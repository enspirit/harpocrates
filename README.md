harpocrates
===========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/harpocrates.svg)](https://npmjs.org/package/harpocrates)
[![Downloads/week](https://img.shields.io/npm/dw/harpocrates.svg)](https://npmjs.org/package/harpocrates)
[![License](https://img.shields.io/npm/l/harpocrates.svg)](https://github.com/enspirit/harpocrates/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @enspirit/harpocrates
$ harpocrates COMMAND
running command...
$ harpocrates (-v|--version|version)
@enspirit/harpocrates/0.0.1 linux-x64 node-v12.18.0
$ harpocrates --help [COMMAND]
USAGE
  $ harpocrates COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`harpocrates help [COMMAND]`](#harpocrates-help-command)
* [`harpocrates send TO`](#harpocrates-send-to)
* [`harpocrates server`](#harpocrates-server)
* [`harpocrates setup`](#harpocrates-setup)

## `harpocrates help [COMMAND]`

display help for harpocrates

```
USAGE
  $ harpocrates help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `harpocrates send TO`

Send a password to another user

```
USAGE
  $ harpocrates send TO

ARGUMENTS
  TO  the recipient of your message

DESCRIPTION
  ...
  This command connects to the harpocrates hub, waits for the user to connect and then prompts the user for the password 
  that needs to be shared
```

_See code: [src/commands/send.js](https://github.com/enspirit/harpocrates/blob/v0.0.1/src/commands/send.js)_

## `harpocrates server`

Starts a harprocrates server

```
USAGE
  $ harpocrates server

OPTIONS
  -p, --port=port  [default: 3000] port to use for the server

DESCRIPTION
  ...
  This command starts a harpocrates server used as a hub for users to communicate with each other
```

_See code: [src/commands/server.js](https://github.com/enspirit/harpocrates/blob/v0.0.1/src/commands/server.js)_

## `harpocrates setup`

Sets up harprocrates

```
USAGE
  $ harpocrates setup

OPTIONS
  -f, --force              forces the setup
  -h, --hub=hub            (required) the address of the harpocates hub
  -u, --username=username  (required) your username

DESCRIPTION
  ...
  This command initializes harpocrates, creating a new rsa pair for encryption of passwords
```

_See code: [src/commands/setup.js](https://github.com/enspirit/harpocrates/blob/v0.0.1/src/commands/setup.js)_
<!-- commandsstop -->
