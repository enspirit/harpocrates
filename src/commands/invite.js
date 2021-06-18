const { Command } = require('@oclif/command');
const createClient = require('../client');
const { load: loadConfig } = require('../core/config');

class InviteCommand extends Command {
  async run() {
    const config = loadConfig();
    const client = await createClient(config);
    await client.authenticate();
    const token = await client.getInvitationToken();
    console.log(token);
  }
}

InviteCommand.description = `Invites a user to join a harprocrates hub
...
This command connects to a harpocrates hub and generates an invitation token that you can give to another user for them to use with 'harpocrates join'.
`;

InviteCommand.flags = {
};

module.exports = InviteCommand;
