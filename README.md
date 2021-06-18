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
@enspirit/harpocrates/0.0.9 darwin-x64 node-v12.18.4
$ harpocrates --help [COMMAND]
USAGE
  $ harpocrates COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`harpocrates autocomplete [SHELL]`](#harpocrates-autocomplete-shell)
* [`harpocrates help [COMMAND]`](#harpocrates-help-command)
* [`harpocrates hub`](#harpocrates-hub)
* [`harpocrates invite`](#harpocrates-invite)
* [`harpocrates join`](#harpocrates-join)
* [`harpocrates list-users`](#harpocrates-list-users)
* [`harpocrates receive`](#harpocrates-receive)
* [`harpocrates send TO`](#harpocrates-send-to)
* [`harpocrates setup`](#harpocrates-setup)

## `harpocrates autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ harpocrates autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ harpocrates autocomplete
  $ harpocrates autocomplete bash
  $ harpocrates autocomplete zsh
  $ harpocrates autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

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

## `harpocrates hub`

Starts a harprocrates hub

```
USAGE
  $ harpocrates hub

OPTIONS
  -p, --port=port  [default: 3000] port to use for the server

DESCRIPTION
  ...
  This command starts a hub used by users to communicate with each other
```

_See code: [src/commands/hub.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/hub.js)_

## `harpocrates invite`

Invites a user to join a harprocrates hub

```
USAGE
  $ harpocrates invite

DESCRIPTION
  ...
  This command connects to a harpocrates hub and generates an invitation token that you can give to another user for 
  them to use with 'harpocrates join'.
```

_See code: [src/commands/invite.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/invite.js)_

## `harpocrates join`

Join a harpocrates hub for the first time

```
USAGE
  $ harpocrates join

DESCRIPTION
  ...
  This command allows you to join the harpocrates hub for the first time as a non authenticated member.
  In order to join a hub you need an invitation token.
  Invitation tokens can be generated by users that are already on a hub by using the command: harpocrates invite
```

_See code: [src/commands/join.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/join.js)_

## `harpocrates list-users`

List the users connected to the hub

```
USAGE
  $ harpocrates list-users
```

_See code: [src/commands/list-users.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/list-users.js)_

## `harpocrates receive`

Connect to the hub and wait for messages...

```
USAGE
  $ harpocrates receive

DESCRIPTION
  This command connects to the harpocrates hub and waits for incoming messages from users
```

_See code: [src/commands/receive.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/receive.js)_

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

_See code: [src/commands/send.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/send.js)_

## `harpocrates setup`

Sets up harprocrates

```
USAGE
  $ harpocrates setup

OPTIONS
  -f, --force              forces the setup
  -h, --hub=hub            (required) the address of the harpocates hub
  -u, --username=username  (required) [default: llambeau] your username

DESCRIPTION
  ...
  This command initializes harpocrates, creating a new rsa pair for authentication and encryption of messages
```

_See code: [src/commands/setup.js](https://github.com/enspirit/harpocrates/blob/v0.0.9/src/commands/setup.js)_
<!-- commandsstop -->
