const io = require('socket.io-client');
const { UnreachableError } = require('../core/robust');
const { HANDSHAKE } = require('../core/constants');
const keys = require('../core/keys');
const debug = require('debug');

class Client {
  #config;
  #socket;

  constructor(config, socket) {
    this.#config = config;
    this.#socket = socket;
  }

  waitForMessages(fn = () => {}) {
    this.#socket.emit('listen');
    this.#socket.on('message', (data) => {
      debug('receiving private message from', data.from);
      const message = keys.decrypt(data.message, this.#config.privateKey);
      debug('->', message);
      fn(message, data.from);
    });
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      this.#socket.emit('auth', {
        username: this.#config.username,
        handshake: keys.sign(HANDSHAKE, this.#config.privateKey)
      }, (data) => {
        if (data === 'ok') {
          return resolve();
        }
        reject(new Error('Authentication failed'));
      });
    });
  }

  sendTo(recipient, content) {
    debug('Ringing', recipient);
    return new Promise((resolve, reject) => {
      this.#socket.emit('ring', {
        recipient
      }, ({ err, publicKey }) => {
        if (err) {
          return reject(new Error(err));
        }
        debug('Got recipient public key, encrypting message');
        const key = keys.factorPublic(publicKey);
        const encrypted = keys.encrypt(content, key);
        debug('Sending encrypted message to recipient...');
        this.#socket.emit('privateMessage', {
          recipient,
          message: encrypted
        }, (res) => {
          if (res.err) {
            return reject(new Error(res.err));
          }
          resolve();
        });
      });
    });
  }

  disconnect() {
    debug('Disconnecting from hub...');
    this.#socket.close();
  }

  getInvitation() {
    debug('Getting an invite token from the hub...');
    return new Promise((resolve, reject) => {
      this.#socket.emit('getInvite', {}, ({ err, invite }) => {
        if (err) {
          return reject(new Error(err));
        }
        resolve(invite);
      });
    });
  }

  joinHub({ username, token }) {
    debug('Trying to join hub with invitation...');
    return new Promise((resolve, reject) => {
      this.#socket.emit('joinHub', {
        username,
        token,
        publicKey: keys.export(this.#config.publicKey)
      }, ({ err }) => {
        if (err) {
          return reject(new Error(err));
        }
        resolve();
      });
    });
  }

  listUsers() {
    return new Promise((resolve, reject) => {
      this.#socket.emit('listUsers', {}, ({ err, users }) => {
        if (err) {
          return reject(new Error(err));
        }
        resolve(users);
      });
    });
  }
}

module.exports = (config) => {
  const maxRetries = 3;
  let attempts = 3;

  return new Promise((resolve, reject) => {
    debug('Trying to connect to the Harpocrates hub...');
    const socket = io(config.hub, { reconnectionDelayMax: 3000, reconnectionAttempts: maxRetries });

    socket.on('connect', () => {
      debug('Connected to Harpocrates hub...');
      resolve(new Client(config, socket));
    });

    socket.on('connect_error', (err) => {
      attempts--;
      if (!attempts) {
        reject(new UnreachableError('Unable to reach the harpocrates hub'));
      }
    });

  });
};

