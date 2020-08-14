# Node.js client for Notify.Events

A simple node.js extension that simplifies the process of integrating your project with the [Notify.Events](https://notify.events) service to send messages to your channels.

#### Instruction in other languages

- [Русский](/docs/ru-RU/README.md)

# Installation

The preferred way to install this extension is through [npm](https://www.npmjs.com/get-npm).

Either run

```
npm install @notify.events/nodejs
```

or add

```
"@notify.events/nodejs": "~1.0"
```

to the dependencies section of your package.json.

# Usage

To use this extension, you need to import the Message class into your Node.js script.

If you have used npm for installation, it will be enough to include lib like this:

```nodejs
const Message = require('@notify.events/nodejs').Message;
```

Otherwise, if you added the lib manually, you need to import the Message by full path:

```nodejs
const Message = require('./path/to/your/Message');
```

After that, you can create a message object, set the necessary parameters and send the message to the channel.

### Usage example

```nodejs
const Message = require('@notify.events/nodejs').Message;

// Defining channel token.
// You get this token when creating a channel on the Notify.Events service.
const token = 'XXXXXXXX';

// Create a message object.
const message = new Message('Some <b>important</b> message', 'Title', Message.PRIORITY_HIGH, Message.LEVEL_ERROR);

// Attach the file to the message.
message.addFile('path\to\local\file');

// Send a message to your channel in Notify.Events.
message.send(token);
```