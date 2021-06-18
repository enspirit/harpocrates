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

  return {
    getUser,
    getUserPublicKey
  };
};
