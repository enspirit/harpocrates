const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');
const cli = require('cli-ux').default;

class ReceiveCommand extends Command {
  async run() {
    const config = loadConfig();
    cli.action.start('Connecting to the hub');
    const client = await createClient(config);
    cli.action.stop();
    cli.action.start('Authenticating');
    await client.authenticate();
    cli.action.stop();
    cli.action.start('Waiting for messages');
    client.waitForMessages((msg, from) => {
      this.log(`FROM: ${from}\n${msg}`);
    });
  }
}

ReceiveCommand.description = `Connect to the hub and wait for messages...
This command connects to the harpocrates hub and waits for incoming messages from users
`;

module.exports = ReceiveCommand;
