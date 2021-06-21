const blessed = require('blessed');
const contrib = require('blessed-contrib');
const colors = require('colors/safe');

module.exports = class REPL {

  #client;
  #screen;
  #messageList;
  #userList;
  #input;

  constructor(client) {
    this.#client = client;

    this.#screen = blessed.screen({
      smartCSR: true,
      title: 'Harpocrates'
    });

    this.#messageList = blessed.list({
      label: 'Messages',
      align: 'left',
      tags: true,
      padding: {
        left: 1,
        top: 1
      },
      width: '70%',
      height: '90%',
      top: 0,
      left: 0,
      scrollbar: {
        ch: ' ',
        inverse: true
      },
      border: 'line',
      items: []
    });

    this.#userList = contrib.table({
      keys: true,
      interactive: true,
      label: 'Users',
      width: '30%',
      height: '90%',
      top: 0,
      right: 0,
      border: { type: 'line', fg: 'cyan' },
      columnWidth: [12, 2]
    });

    this.#input = blessed.textbox({
      bottom: 0,
      height: '10%',
      inputOnFocus: true,
      padding: {
        top: 1,
        left: 2
      },
      style: {
        focus: {
          fg: '#f6f6f6',
          bg: '#353535'
        }
      }
    });
  }

  async start() {
    this.#screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0);
    });

    this.#screen.append(this.#messageList);
    this.#screen.append(this.#userList);
    this.#screen.append(this.#input);

    this.#client.on('message', ({ message, from }) => {
      const date = (new Date()).toTimeString().split(' ')[0];
      this.#messageList.addItem(` ${date} @${from}: ${message}`);
      this.#messageList.scrollTo(100);
      this.#screen.render();
    });

    this.#client.on('error', (err) => {
      const date = (new Date()).toTimeString().split(' ')[0];
      this.#messageList.addItem(colors.red(` ${date} ERR: ${err.message}`));
      this.#messageList.scrollTo(100);
      this.#screen.render();
    });

    const refreshUserList = (users) => {
      const tableData = users.map(u => {
        const status = u.connected ? 'x' : ' ';
        const color = u.connected ? colors.green : colors.red;
        return [color(u.username), status];
      });
      this.#userList.setData({
        headers: ['Username', 'Online'],
        data: tableData
      });
      this.#screen.render();
    };

    const users = await this.#client.listUsers();
    refreshUserList(users);

    this.#client.on('userList', (users) => {
      refreshUserList(users);
    });

    this.#input.on('submit', async (text) => {
      try {
        const username = text.split(' ')[0].substr(1);
        const message = text.split(' ').slice(1).join(' ');

        const date = (new Date()).toTimeString().split(' ')[0];
        this.#messageList.addItem(`{right}${date} @${username}: ${message} {/right}`);
        this.#messageList.scrollTo(100);
        this.#screen.render();

        await this.#client.sendTo(username, message);
      } catch (err) {
        // error handling
      } finally {
        this.#input.clearValue();
        this.#screen.render();
      }
    });

    this.#screen.render();

    this.#userList.rows.on('select', (row, userIndex) => {
      const { username } = users[userIndex];
      this.#input.setValue(`@${username} `);
      this.#input.focus();
      this.#screen.render();
    });

    this.#userList.focus();
    this.#screen.render();
  }

};
