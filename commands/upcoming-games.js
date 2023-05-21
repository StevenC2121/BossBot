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

    switch (league.toLowerCase()) {
      case 'pl': 
        leagueCode = 'PL';
        break;
      case 'cl': 
        leagueCode = 'CL';
        break;
      case 'wc': 
        leagueCode = 'WC';
        break;
      case 'bl1': 
        leagueCode = 'BL1';
        break;
      case 'ded':
        leagueCode = 'DED';
        break;
      case 'pd':
        leagueCode = 'PD'
        break;
      case 'fl1':
        leagueCode = 'FL1';
        break;
      case 'elc':
        leagueCode = 'ELC';
        break;
      case 'ppl':
        leagueCode = 'PPL';
        break;
      case 'sa': 
        leagueCode = 'SA';
        break;
      case 'cli':
        leagueCode = 'CLI';
        break;
      case 'help':
        message.channel.createMessage('Valid Leagues include: \npl (Premier League)\ncl (Champions League)\nbl1 (Bundesliga)\nbsa (Campeonato Brasileiro Série A)\npd (Primera Division)\nfl1 (France Ligue 1)\nelc (English Championship)\nppl (Primeira Liga\nec (European Championship)\nsa (Italian Serie A)\nwc (World Cup)\ncli (Copa Libertadores)');
        return;
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
        title: `Upcoming ${league.toUpperCase()} Matches`,
        fields: gameFields,
        color: 2123412,
      },
    });
  } 
  catch (error) {
    console.error(error);
  }
});
