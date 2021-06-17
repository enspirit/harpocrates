class HaprocratesError extends Error {}
class AlreadySetupError extends HaprocratesError {}
class UnreachableError extends HaprocratesError {}
class InvalidConfigError extends HaprocratesError {}
class CannotLoadConfigError extends HaprocratesError {}

module.exports = {
  HaprocratesError,
  AlreadySetupError,
  UnreachableError,
  InvalidConfigError,
  CannotLoadConfigError
};
