const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { HANDSHAKE } = require('../core/constants');
const keys = require('../core/keys');
const loadUserDB = require('./userdb');

module.exports = (port = 3000) => {
  const server = http.createServer(app);
  const io = new Server(server);
  const userdb = loadUserDB();

  app.get('/', (req, res) => {
    res.send({
      name: 'harprocrates',
      version: require('../../package.json').version
    });
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('auth', (msg, reply) => {
      const { username, handshake } = msg;
      console.log('Someone is trying to auth as', username);
      const userPublicKey = userdb[username];
      if (!userPublicKey) {
        console.log('Unknown user', username);
        return reply('unknown-user');
      }
      const verified = keys.verify(handshake, HANDSHAKE, userPublicKey);
      if (!verified) {
        reply('invalid-handshake');
        return socket.disconnect();
      }
      socket.username = msg.username;
      socket.authenticated = true;
      reply('ok');
    });

    socket.on('listen', () => {
      if (!socket.authenticated) {
        socket.emit('unauthorized');
        return socket.disconnect();
      }
      console.log(socket.username, 'joining their own room');
      socket.join(socket.username);
    });

    socket.on('ring', (msg, reply) => {
      if (!socket.authenticated) {
        socket.emit('unauthorized');
        return socket.disconnect();
      }
      console.log(socket.username, 'wants to contact', msg.recipient);
      const recipientPublicKey = userdb[msg.recipient];
      if (!recipientPublicKey) {
        return reply({ err: 'unknown-recipient' });
      }
      reply({ publicKey: keys.export(recipientPublicKey) });
    });

    socket.on('privateMessage', (msg, reply) => {
      if (!socket.authenticated) {
        socket.emit('unauthorized');
        return socket.disconnect();
      }
      console.log(socket.username, 'wants to send data to', msg.recipient);
      if (!userdb[msg.recipient]) {
        console.error(msg.recipient, 'is an unknown recipient');
        return reply('unknown-recipient');
      }
      const roomMembers = io.sockets.adapter.rooms.get(msg.recipient);
      if (!roomMembers) {
        console.error(msg.recipient, 'is not home');
        return reply({ err: 'no-one-home' });
      }
      io.sockets.in(msg.recipient).emit('message', {
        from: socket.username,
        message: msg.message
      });
      reply('ok');
    });
  });

  server.listen(port, () => {
    console.log(`Haprocrates hub is now listening on *:${port}`);
  });
};

