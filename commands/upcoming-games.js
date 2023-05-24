const { Command } = require('yuuko');
const got = require('got');
require('dotenv').config();

module.exports = new Command('upcoming', async (message, args) => {
  try {
    if (!args || args.length < 1) {
      message.channel.createMessage('Please provide a league code! Example: upcoming pl');
      return;
    }
    

    const league = args[0];
    let leagueCode;
    let leagueFullName;


    switch (league.toLowerCase()) {
      case 'pl': 
        leagueCode = 'PL';
        leagueFullName = "English Premier League";
        break;
      case 'cl': 
        leagueCode = 'CL';
        leagueFullName = "UEFA Champions League";
        break;
      case 'wc': 
        leagueCode = 'WC';
        leagueFullName = "World Cup";
        break;
      case 'bl1': 
        leagueCode = 'BL1';
        leagueFullName = "Bundesliga";
        break;
      case 'ded':
        leagueCode = 'DED';
        leagueFullName = "Eredivisie";
        break;
      case 'pd':
        leagueCode = 'PD'
        leagueFullName = "LaLiga";
        break;
      case 'fl1':
        leagueCode = 'FL1';
        leagueFullName = "France Ligue 1";
        break;
      case 'elc':
        leagueCode = 'ELC';
        leagueFullName = "English Championship";
        break;
      case 'ppl':
        leagueCode = 'PPL';
        leagueFullName = "Portuguese Primeira Liga";
        break;
      case 'sa': 
        leagueCode = 'SA';
        leagueFullName = "Italian Serie A";
        break;
      case 'cli':
        leagueCode = 'CLI';
        leagueFullName = "Copa Libertadores";
        break;
      case 'help':
        message.channel.createMessage({
          embed: {
            title: 'Valid League Inputs Include: ',
            fields: [
              {
                name: 'PL',
                value: 'Premier League',
              },
              {
                name: 'CL',
                value: 'Champions League',
              },
              {
                name: 'BL1',
                value: 'Bundesliga',
              },
              {
                name: 'BSA',
                value: 'Campeonato Brasileiro Série A',
              },
              {
                name: 'PD',
                value: 'Primera Division (LaLiga)',
              },
              {
                name: 'FL1',
                value: 'France Ligue 1',
              },
              {
                name: 'ELC',
                value: 'English Championship',
              },
              {
                name: 'PPL',
                value: 'Portuguese Primeira Liga',
              },
              {
                name: 'EC',
                value: 'European Championship',
              },
              {
                name: 'SA',
                value: 'Italian Serie A',
              },
              {
                name: 'WC',
                value: 'World Cup',
              },
              {
                name: 'CLI',
                value: 'Copa Libertadores',
              },
            ],
            color: 15267908, 
          },
        });
      default:
        message.channel.createMessage('Invalid league! Please provide a valid league for upcoming matches.');
        return;
    }

    const response = await got.get(`https://api.football-data.org/v4/competitions/${leagueCode}/matches?status=SCHEDULED`, {
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
        title: `Upcoming ${leagueFullName} Matches:`,
        fields: gameFields,
        color: 2123412,
      },
    });
  } 
  catch (error) {
    console.error(error);
  }
});
