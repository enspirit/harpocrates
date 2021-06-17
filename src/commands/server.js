const { Command, flags } = require('@oclif/command');
const createServer = require('../server');

class ServerCommand extends Command {
  async run() {
    const { flags } = this.parse(ServerCommand);
    createServer(flags.port);
  }
}

ServerCommand.description = `Starts a harprocrates server
...
This command starts a harpocrates server used as a hub for users to communicate with each other
`;

ServerCommand.flags = {
  port: flags.string({ char: 'p', default: 3000, parse: Number, description: 'port to use for the server' })
};

module.exports = ServerCommand;
