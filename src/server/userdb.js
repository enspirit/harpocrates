const path = require('path');
const keys = require('../core/keys');
const users = require(path.join(process.cwd(), 'users.json'));

module.exports = Object.keys(users).reduce((db, username) => {
  try {
    db[username] = keys.factorPublic(users[username]);
  } catch (err) {
    console.error(`Public key for ${username} is invalid, skipping`);
  }
  return db;
}, {});
