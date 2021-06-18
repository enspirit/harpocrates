const { Command, flags } = require('@oclif/command');
const createHub = require('../hub');

class HubCommand extends Command {
  async run() {
    const { flags } = this.parse(HubCommand);
    createHub(flags.port);
  }
}

HubCommand.description = `Starts a harprocrates hub
...
This command starts a hub used by users to communicate with each other
`;

HubCommand.flags = {
  port: flags.string({ char: 'p', default: 3000, parse: Number, description: 'port to use for the server' })
};

module.exports = HubCommand;
