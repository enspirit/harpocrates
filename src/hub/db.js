const path = require('path');
const keys = require('../core/keys');

module.exports = () => {
  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: path.join(process.cwd(), 'users.sqlite')
    }
  });

  const getUser = async (username) => {
    const [user] = await knex('users')
      .where({ username });
    return user;
  };

  const getUserPublicKey = async (username) => {
    const user = await getUser(username);
    if (!user) {
      return;
    }
    return keys.factorPublic(user.publicKey);
  };

  const createUser = async ({ username, publicKey }) => {
    console.log('creating with', username, publicKey);
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
    createUser
  };
};
