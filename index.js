const { Client } = require('yuuko');
const path = require('path');
require('dotenv').config();

const bot = new Client({
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    ignoreBots: true,
});

bot.editStatus('Online');

bot.on('error', (err) => {
    console.error(err);
});

bot
    .addDir(path.join(__dirname, 'commands'))
    .addDir(path.join(__dirname, 'events'))
    .connect();
