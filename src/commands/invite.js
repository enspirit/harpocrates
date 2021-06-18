const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');

class InviteCommand extends Command {
  async run() {
    const config = loadConfig();
    const client = await createClient(config);
    await client.authenticate();
    const invitation = await client.getInvitation();
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
