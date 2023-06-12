const { Command } =  require('yuuko');

module.exports = new Command('Help', (message) => {
    message.channel.createMessage({
        
        embed: {
            title: 'Main Bot Commands',
            fields: [
                {
                    name: 'Upcoming Command: upcoming schedule for any soccer league',
                    value: 'Example: bb!upcoming pl'
                },
                {
                    name: 'Odds Command: betting odds for a given teams next game',
                    value: 'Example: bb!odds nfl ravens'
                },
                {
                    name: 'Hello Command: ensures bot is ready to use',
                    value: 'Example: bb!hello'
                },
                {
                    name: 'Help Command: displays all bot commands',
                    value: 'Example: bb!help' 
                }
                
            ],
            color: 15548997
        }
    });
})