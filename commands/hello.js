const { Command } = require('yuuko');
module.exports = new Command('Hello', (message, args, context) => {
    message.channel.createMessage('I AM ALIVE!');
})