const fs = require('fs');
const path = require('path');
const keys = require('./keys');
const { KeyObject } = require('crypto');
const { InvalidConfigError, CannotLoadConfigError } = require('../core/robust');

const getPaths = () => {
  const basePath = process.env.HAPROCRATES_HOME || path.join(process.env.HOME, '.harpocrates');
  return {
    home: basePath,
    publicKey: path.join(basePath, 'public.key'),
    privateKey: path.join(basePath, 'private.key'),
    config: path.join(basePath, 'config.json')
  };
};

module.exports = {
  load: () => {
    const paths = getPaths();
    if (!fs.existsSync(paths.home)) {
      throw new CannotLoadConfigError('Haprocrates home not found');
    }
    if (!fs.existsSync(paths.publicKey)) {
      throw new CannotLoadConfigError('Haprocrates public key not found');
    }
    if (!fs.existsSync(paths.privateKey)) {
      throw new CannotLoadConfigError('Haprocrates private key not found');
    }
    if (!fs.existsSync(paths.config)) {
      throw new CannotLoadConfigError('Haprocrates config file not found');
    }

    const publicKey = keys.factorPublic(fs.readFileSync(paths.publicKey));
    const privateKey = keys.factorPrivate(fs.readFileSync(paths.privateKey));
    let config;
    try {
      config = JSON.parse(fs.readFileSync(paths.config));
    } catch (err) {
      throw new InvalidConfigError('Harpocrates config is incorrect');
    }
    return Object.assign({}, config, { publicKey, privateKey });
  },

  save: (config) => {
    if (!config.username) {
      throw new InvalidConfigError('Username required');
    }
    if (!(config.privateKey instanceof KeyObject)) {
      throw new InvalidConfigError('Private key required');
    }
    if (!(config.publicKey instanceof KeyObject)) {
      throw new InvalidConfigError('Private key required');
    }
    const { publicKey, privateKey, ...rest } = config;
    const paths = getPaths();
    if (!fs.existsSync(paths.home)) {
      fs.mkdirSync(paths.home);
    }
    fs.writeFileSync(paths.publicKey, keys.export(publicKey));
    fs.writeFileSync(paths.privateKey, keys.export(privateKey));
    fs.writeFileSync(paths.config, JSON.stringify(rest));
  }
};
