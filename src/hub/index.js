const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { HANDSHAKE } = require('../core/constants');
const keys = require('../core/keys');
const dbConnect = require('./db');
const invites = require('./invites');

module.exports = async (port = 3000) => {
  const server = http.createServer(app);
  const io = new Server(server);
  const db = dbConnect();

  // If we don't have users, let's generate a first invitation for the first user to join
  const count = await db.countUsers();
  if (!count) {
    const invite = await invites.createInvite();
    console.log('No users found in database, please use the following invitation to join your first user');
    console.log(invite);
  }

  app.get('/', (req, res) => {
    res.send({
      name: 'harprocrates',
      version: require('../../package.json').version
    });
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('auth', async (msg, reply) => {
      const { username, handshake } = msg;
      console.log('Someone is trying to auth as', username);
      const userPublicKey = await db.getUserPublicKey(username);
      if (!userPublicKey) {
        console.log('Unknown user', username);
        return reply('unknown-user');
      }
      const verified = keys.verify(handshake, HANDSHAKE, userPublicKey);
      if (!verified) {
        console.log('Invalid handshake for user', username);
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

    socket.on('ring', async (msg, reply) => {
      if (!socket.authenticated) {
        reply({ err: 'unauthorized' });
        return socket.disconnect();
      }
      console.log(socket.username, 'wants to contact', msg.recipient);
      const recipientPublicKey = await db.getUserPublicKey(msg.recipient);
      if (!recipientPublicKey) {
        return reply({ err: 'unknown-recipient' });
      }
      reply({ publicKey: keys.export(recipientPublicKey) });
    });

    socket.on('privateMessage', async (msg, reply) => {
      if (!socket.authenticated) {
        reply({ err: 'unauthorized' });
        return socket.disconnect();
      }
      console.log(socket.username, 'wants to send data to', msg.recipient);
      const user = await db.getUser(msg.recipient);
      if (!user) {
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

    socket.on('getInvite', async (msg, reply) => {
      if (!socket.authenticated) {
        reply({ err: 'unauthorized' });
        return socket.disconnect();
      }
      const invite = await invites.createInvite();
      reply({ invite });
    });

    socket.on('joinHub', async ({ username, token, publicKey }, reply) => {
      if (socket.authenticated) {
        reply({ err: 'already-joined' });
        return socket.disconnect();
      }
      if (!invites.checkInvite(token)) {
        reply({ err: 'invalid-token' });
        return socket.disconnect();
      }
      try {
        await db.createUser({ username, publicKey });
        invites.removeInvite(token);
      } catch (err) {
        reply({ err: err.message });
        return socket.disconnect();
      }
      reply('ok');
    });
  });

  server.listen(port, () => {
    console.log(`Haprocrates hub is now listening on *:${port}`);
  });
};

