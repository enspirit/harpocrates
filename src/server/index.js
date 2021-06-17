const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { HANDSHAKE } = require('../core/constants');
const path = require('path');
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
      console.log('Person trying to auth', username);
      const userPublicKey = userdb[username];
      if (!userPublicKey) {
        console.log('Unknown user', username);
        return reply('unknown-user');
      }
      const verified = keys.verify(handshake, HANDSHAKE, userPublicKey);
      if (!verified) {
        return reply('invalid-handshake');
      }
      socket.username = msg.username;
      reply('ok');
    });

    socket.on('listen', () => {
      console.log(socket.username, 'joining their own room');
      socket.join(socket.username);
    });

    socket.on('ring', (msg, reply) => {
      console.log(socket.username, 'wants to contact', msg.recipient);
      const recipientPublicKey = userdb[msg.recipient];
      if (!recipientPublicKey) {
        return reply('unknown-recipient');
      }
      reply({ publicKey: keys.export(recipientPublicKey) });
    });

    socket.on('privateMessage', (msg, reply) => {
      console.log(socket.username, 'wants to send data to', msg.recipient);
      if (!userdb[msg.recipient]) {
        console.error(msg.recipient, 'is an unknown recipient');
        return reply('unknown-recipient');
      }
      console.log('forwarding private message to', msg.recipient);
      io.sockets.in(msg.recipient).emit('message', {
        from: socket.username,
        message: msg.message
      });
      reply('ok');
    });
  });

  server.listen(port, () => {
    console.log(`Haprocrates server is now listening on *:${port}`);
  });
};

