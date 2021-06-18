const path = require('path');
const keys = require('../core/keys');

module.exports = () => {
  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH || path.join(process.cwd(), 'harpocrates.sqlite')
    }
  });

  const getUser = async (username) => {
    const [user] = await knex('users')
      .where({ username });
    return user;
  };

  const listUsers = async () => {
    return knex('users')
      .select('username');
  };

  const getUserPublicKey = async (username) => {
    const user = await getUser(username);
    if (!user) {
      return;
    }
    return keys.factorPublic(user.publicKey);
  };

  const countUsers = async () => {
    const rs = await knex('users')
      .count('* as count');
    return rs[0].count;
  };

  const createUser = async ({ username, publicKey }) => {
    if (!username) {
      throw new Error('Invalid username');
    }
    if (!publicKey) {
      throw new Error('Invalid public key');
    }
    try {
      keys.factorPublic(publicKey);
    } catch {
      throw new Error('Invalid public key');
    }
    const user = await getUser(username);
    if (user) {
      throw new Error('Username already exists');
    }
    return knex('users').insert({
      username,
      publicKey
    });
  };

  return {
    getUser,
    getUserPublicKey,
    createUser,
    countUsers,
    listUsers
  };
};
