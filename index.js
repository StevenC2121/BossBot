const { Client } = require('yuuko');
const path = require('path');
require('dotenv').config();

const bot = new Client({
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    ignoreBots: true,
});

bot.extendContext({
    variableOne: 'Variable number 1!',
});
bot.editStatus('dnd');

bot.on('error', (err) => {
    console.error(err);
});

bot
    .addDir(path.join(__dirname, 'commands'))
    .addDir(path.join(__dirname, 'events'))
    .connect();
