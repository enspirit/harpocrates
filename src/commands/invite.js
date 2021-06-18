const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');
const cli = require('cli-ux').default;

class InviteCommand extends Command {
  async run() {
    const config = loadConfig();
    cli.action.start('Connecting to the hub');
    const client = await createClient(config);
    cli.action.stop();
    cli.action.start('Authenticating');
    await client.authenticate();
    cli.action.stop();
    cli.action.start('Generating invitation');
    const invitation = await client.getInvitation();
    cli.action.stop();

    const expiresIn = (invitation.expire - Date.now()) / 1000;
    this.log(`The hub generated the following token: \n\n${invitation.token}\n`);
    this.log('Please provide this token to another user so that they can join');
    this.warn(`! the invitation will expire in ${expiresIn} seconds !`);
    client.disconnect();
  }
}

InviteCommand.description = `Invites a user to join a harprocrates hub
...
This command connects to a harpocrates hub and generates an invitation token that you can give to another user for them to use with 'harpocrates join'.
`;

InviteCommand.flags = {
};

module.exports = InviteCommand;
