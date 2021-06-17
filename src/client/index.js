const io = require('socket.io-client');
const { UnreachableError } = require('../core/robust');
const { HANDSHAKE } = require('../core/constants');
const keys = require('../core/keys');

class Client {
  #config;
  #socket;

  constructor(config, socket) {
    this.#config = config;
    this.#socket = socket;

    this.#socket.on('message', (data) => {
      console.log('receiving private message from', data.from);
      const message = keys.decrypt(data.message, config.privateKey);
      console.log('->', message);
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
    console.log('Ringing', recipient);
    this.#socket.emit('ring', {
      recipient
    }, ({ publicKey }) => {
      const key = keys.factorPublic(publicKey);
      const encrypted = keys.encrypt(content, key);
      console.log('Got recipient public key, sending encrypted message');
      this.#socket.emit('privateMessage', {
        recipient,
        message: encrypted
      });
    });
  }

  disconnect() {
    console.log('Disconnecting from hub...');
    this.#socket.close();
  }
}

module.exports = (config) => {
  const maxRetries = 3;
  let attempts = 3;

  return new Promise((resolve, reject) => {
    console.log('Trying to connect to the Harpocrates hub...');
    const socket = io(config.hub, { reconnectionDelayMax: 3000, reconnectionAttempts: maxRetries });

    socket.on('connect', () => {
      console.log('Connected to Harpocrates hub...');
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
