const { Command } = require('yuuko');
const got = require('got');
require('dotenv').config();
const api_key = process.env.ODDSTOKEN;

module.exports = new Command('odds', async (message, args) => {
    try {
        const response = await got.get(`https://api.the-odds-api.com/v4/sports/?apiKey=${api_key}`, {
            responseType: 'json',
        });
        const sportsData = response.body;
        const activeSports = sportsData.filter((sport) => sport.active);
        const sportsFields = activeSports.map((sport) => {
            const sportTitle = sport.title;
            const sportDesc = sport.description;
            const sportGroup = sport.group;
            const sportOutrights = sport.has_outrights;
            return {
                name: `${sportTitle} / ${sportDesc}`,
                value: `Sport: ${sportGroup}`,
            };
        });
        message.channel.createMessage({
            embed: {
                title: `Active Sports/Leagues With Available Betting Odds:`,
                fields: sportsFields,
                color: 2123412,
            },
        });
    } catch (error) {
        console.error(error);
    }
});
