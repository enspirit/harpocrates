const { Command } = require('@oclif/command');
const cli = require('cli-ux').default;
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');

class SendCommand extends Command {
  async run() {
    const { flags, args } = this.parse(SendCommand);
    const config = loadConfig();
    const client = await createClient(config);
    await client.authenticate();

    const data = await cli.prompt('Please introduce the content you want to share');
    await client.sendTo(args.to, data);
    client.disconnect();
  }
}

SendCommand.description = `Send a password to another user
...
This command connects to the harpocrates hub, waits for the user to connect and then prompts the user for the password that needs to be shared
`;

SendCommand.args = [{
  name: 'to',
  required: true,
  description: 'the recipient of your message'
}];

SendCommand.flags = {
};

module.exports = SendCommand;
