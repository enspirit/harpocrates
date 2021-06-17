const config = require('./config');
const keys = require('./keys');
const { AlreadySetupError, CannotLoadConfigError } = require('./robust');

const DEFAULT_OPTIONS = {
  hub: 'ws://localhost:3000'
};

module.exports = (options = {}, force = false) => {
  let alreadySetup;
  // Check if we have already setup harprocrates
  try {
    alreadySetup = config.load();
  } catch (err) {
    if (!(err instanceof CannotLoadConfigError)) {
      throw err;
    }
    // No config, we can proceed
  }

  // We already have a valid config, let's not override it (except if force=true)
  if (alreadySetup && !force) {
    throw new AlreadySetupError('Harpocrates was already configured.');
  }

  const { publicKey, privateKey } = keys.generatePair();
  config.save(Object.assign({}, DEFAULT_OPTIONS, options, {
    publicKey,
    privateKey
  }));
};
