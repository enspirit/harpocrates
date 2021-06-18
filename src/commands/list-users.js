const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');
const cli = require('cli-ux').default;

class ListUsers extends Command {
  async run() {
    const config = loadConfig();

    cli.action.start('Connecting to the hub');
    const client = await createClient(config);
    cli.action.stop();
    cli.action.start('Authenticating');
    await client.authenticate();
    cli.action.stop();

    cli.action.start('Retrieving list of users');
    const users = await client.listUsers();
    cli.action.stop();

    this.log();
    cli.table(users, {
      username: {
        minWidth: 7
      },
      connected: {
        get: u => u.connected ? 'x' : ''
      },
      receiving: {
        get: u => u.receiving ? 'x' : ''
      }
    }, {
      printLine: this.log
    });
    client.disconnect();
  }
}

ListUsers.description = `List the users connected to the hub
`;

module.exports = ListUsers;
