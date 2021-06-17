const crypto = require('crypto');

const KEY_OPTIONS = {
  format: 'pem',
  type: 'pkcs1'
};

module.exports = {
  factorPrivate: (key) => {
    return crypto.createPrivateKey(Object.assign({}, KEY_OPTIONS, {
      key
    }));
  },

  factorPublic: (key) => {
    return crypto.createPublicKey(Object.assign({}, KEY_OPTIONS, {
      key
    }));
  },

  export: (key) => {
    if (!(key instanceof crypto.KeyObject)) {
      throw new Error('KeyObject expected');
    }
    return key.export(KEY_OPTIONS);
  },

  generatePair: () => {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048
    });
  },

  sign: (content, privateKey) => {
    if (!(privateKey instanceof crypto.KeyObject)) {
      throw new Error('Private key expected');
    }
    return crypto.sign('sha256', Buffer.from(content), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    });
  },

  verify: (signature, content, publicKey) => {
    if (!(publicKey instanceof crypto.KeyObject)) {
      throw new Error('Public key expected');
    }
    return crypto.verify('sha256', Buffer.from(content), {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    }, signature);
  },

  encrypt: (content, publicKey) => {
    if (!(publicKey instanceof crypto.KeyObject)) {
      throw new Error('Public key expected');
    }
    return crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, Buffer.from(content));
  },

  decrypt: (content, privateKey) => {
    if (!(privateKey instanceof crypto.KeyObject)) {
      throw new Error('Private key expected');
    }
    return crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, content).toString();
  }
};
