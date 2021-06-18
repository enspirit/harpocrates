const crypto = require('crypto');

const TOKEN_LIFETIME = 2 * 60 * 1000; // 2 minutes

const pendingInvites = [];

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString('hex'));
    });
  });
};

module.exports = {
  async createInvite(lifetime = TOKEN_LIFETIME) {
    const token = await createToken();
    const invite = {
      token,
      expire: Date.now() + lifetime
    };
    pendingInvites.push(invite);
    console.log('New invite token generated');
    setTimeout(() => {
      console.log('Expiring invite...');
      this.removeInvite(invite);
    }, lifetime);
    return invite;
  },

  checkInvite(token) {
    const invite = pendingInvites.find(i => i.token === token);
    if (invite && invite.expire <= Date.now()) {
      this.removeInvite(token);
      return;
    }
    return invite;
  },

  removeInvite(token) {
    const index = pendingInvites.findIndex(i => i.token === token);
    if (index) {
      pendingInvites.splice(index, 1);
    }
  }
};
