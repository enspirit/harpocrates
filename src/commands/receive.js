const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');

class ReceiveCommand extends Command {
  async run() {
    const config = loadConfig();
    const client = await createClient(config);
    await client.authenticate();
    client.waitForMessages();
  }
}

ReceiveCommand.description = `Connect to the hub and wait for messages...
This command connects to the harpocrates hub and waits for incoming messages from users
`;

module.exports = ReceiveCommand;
