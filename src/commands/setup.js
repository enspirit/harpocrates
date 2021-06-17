const { Command, flags } = require('@oclif/command');
const { AlreadySetupError } = require('../core/robust');
const setup = require('../core/setup');

class SetupCommand extends Command {
  async run() {
    const { flags } = this.parse(SetupCommand);
    const { force, username, hub } = flags;
    try {
      setup({ username, hub }, force);
    } catch (err) {
      if (err instanceof AlreadySetupError) {
        this.error('Harpocrates is already configured, if you want to regenerate a new key pair use --force');
      }
      throw err;
    }
  }
}

SetupCommand.description = `Sets up harprocrates
...
This command initializes harpocrates, creating a new rsa pair for encryption of passwords
`;

SetupCommand.flags = {
  username: flags.string({ char: 'u', description: 'your username', required: true }),
  hub: flags.string({ char: 'h', description: 'the address of the harpocates hub', required: true }),
  force: flags.boolean({ char: 'f', default: false, description: 'forces the setup' })
};

module.exports = SetupCommand;
