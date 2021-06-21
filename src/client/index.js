const io = require('socket.io-client');
const { UnreachableError } = require('../core/robust');
const EventEmitter = require('events').EventEmitter;
const { HANDSHAKE } = require('../core/constants');
const keys = require('../core/keys');
const debug = require('debug');

class Client extends EventEmitter {
  #config;
  #socket;
  #authenticated;

  constructor(config, socket) {
    super();
    this.#config = config;
    this.#socket = socket;
    this.#authenticated = false;

    this.#socket.on('message', (data) => {
      debug('receiving private message from', data.from);
      const message = keys.decrypt(data.message, this.#config.privateKey);
      this.emit('message', { message, from: data.from });
    });

    this.#socket.on('connect', async () => {
      // We were authenticated in a previous connection, let's reauthenticate
      if (this.#authenticated) {
        await this.authenticate();
      }
    });
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      this.#socket.emit('auth', {
        username: this.#config.username,
        handshake: keys.sign(HANDSHAKE, this.#config.privateKey)
      }, (data) => {
        if (data === 'ok') {
          this.#authenticated = true;
          this.emit('authenticated');
          return resolve();
        }
        const err = new Error('Authentication failed');
        this.emit('error', err);
        reject(err);
      });
    });
  }

  sendTo(recipient, message) {
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
        const encrypted = keys.encrypt(message, key);
        debug('Sending encrypted message to recipient...');
        this.#socket.emit('privateMessage', {
          recipient,
          message: encrypted
        }, (res) => {
          if (res.err) {
            const err = new Error(res.err);
            this.emit('error', err);
            return reject(err);
          }
          this.emit('messageSent', { recipient, message });
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

