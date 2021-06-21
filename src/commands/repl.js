const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');
const cli = require('cli-ux').default;
const REPL = require('./repl/');

class ReplCommand extends Command {
  async run() {
    const config = loadConfig();
    //cli.action.start('Connecting to the hub');
    const client = await createClient(config);
    //cli.action.stop();
    //cli.action.start('Authenticating');
    await client.authenticate();
    //cli.action.stop();
    try {
      const repl = new REPL(client);
      repl.start();
    } catch (err) {
      console.log(err);
      process.exit();
    }
  }
}

ReplCommand.description = `Connect to the hub and wait for messages...
This command connects to the harpocrates hub and waits for incoming messages from users
`;

module.exports = ReplCommand;
