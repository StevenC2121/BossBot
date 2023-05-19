const { Command } = require('yuuko');
const got = require('got');
require('dotenv').config();

module.exports = new Command('upcomingPL', async (message) => {
  try {
    const response = await got.get('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
      responseType: 'json',
      headers: {
        'X-Auth-Token': process.env.SPORTTOKEN, 
      },
    });

    const games = response.body.matches;
    const upcomingGames = games.slice(0, 10);

    const gameFields = upcomingGames.map((game) => {
      const homeTeam = game.homeTeam.name;
      const awayTeam = game.awayTeam.name;
      const startDate = new Date(game.utcDate).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return {
        name: `${homeTeam} vs ${awayTeam}`,
        value: `Start Date: ${startDate} EST`,
      };
    });

    message.channel.createMessage({
      embed: {
        title: 'Upcoming Premier League Matches',
        fields: gameFields,
        color: 2123412,
      },
    });
  } catch (error) {
    console.error(error);
  }
});
