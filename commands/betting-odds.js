const { Command } = require('yuuko');
const got = require('got');
require('dotenv').config();
const api_key = process.env.ODDSTOKEN;

module.exports = new Command('odds', async (message, args) => {
    try {
        if (!args || args.length < 2) {
            message.channel.createMessage('Please provide a sport code and a team name! Example: odds nfl chiefs');
            return;
        }

        const sportCode = args[0];
        const teamName = args.slice(1).join(' ').toLowerCase();

        let sportTitle;
        let sportDesc;
        let sportKey;

        switch (sportCode.toLowerCase()) {
            case 'nfl':
                sportTitle = 'Football';
                sportDesc = 'NFL';
                sportKey = 'americanfootball_nfl';
                break;
            case 'nba':
                sportTitle = 'Basketball';
                sportDesc = 'NBA';
                sportKey = 'basketball_nba';
                break;
            case 'ncaaf':
                sportTitle = 'Football';
                sportDesc = 'NCAAF';
                sportKey = 'americanfootball_ncaaf';
                break;
            case 'mlb':
                sportTitle = 'Baseball';
                sportDesc = 'MLB';
                sportKey = 'baseball_mlb';
                break;
            case 'nhl':
                sportTitle = 'Ice Hockey';
                sportDesc = 'NHL';
                sportKey = 'icehockey_nhl';
                break;
            case 'uefa nations league':
                sportTitle = 'Soccer';
                sportDesc = 'UEFA Nations League';
                sportKey = 'soccer_uefa_nations_league';
                break;
            case 'mls':
                sportTitle = 'Soccer';
                sportDesc = 'MLS';
                sportKey = 'soccer_usa_mls';
                break;
            case 'boxing':
                sportTitle = 'Boxing';
                sportDesc = 'Boxing';
                sportKey = 'boxing_boxing';
                break;                    
            // Add more cases for other sports
            default:
                message.channel.createMessage('Invalid sport code! Please provide a valid sport code for odds.');
                return;
        }

        const response = await got.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${api_key}&regions=us&markets=h2h,spreads&oddsFormat=american`, {
            responseType: 'json',
        });
        const oddsData = response.body;
        

        const teamOdds = oddsData.find((odds) => {
            const homeTeam = odds.home_team.toLowerCase();
            const awayTeam = odds.away_team.toLowerCase();
            return homeTeam.includes(teamName) || awayTeam.includes(teamName);
        });

        if (!teamOdds) {
            message.channel.createMessage(`No odds found for ${teamName} in ${sportTitle}.`);
            return;
        }

        const startDate = new Date(teamOdds.commence_time);
        const options = {
          timeZone: 'America/New_York',
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        };
        const formattedDate = startDate.toLocaleString('en-US', options);
        if (!teamOdds) {
            message.channel.createMessage(`No odds found for ${teamName} in ${sportTitle}.`);
            return;
        }

        const filteredBookmakers = ['DraftKings', 'FanDuel'];

        const oddsFields = [];

        teamOdds.bookmakers
            .filter((bookmaker) => filteredBookmakers.includes(bookmaker.title))
            .forEach((bookmaker) => {
                let mainOdds = false;
                bookmaker.markets
                    .filter((market) => market.last_update.includes('2023'))
                    .forEach((market) => {
                        const homeOutcome = market.outcomes.find((outcome) => outcome.name === teamOdds.home_team);
                        const awayOutcome = market.outcomes.find((outcome) => outcome.name === teamOdds.away_team);

                        if (homeOutcome && awayOutcome && !mainOdds) {
                            const bookmakerTitle = bookmaker.title;
                            const homeOdds = homeOutcome.price;
                            const awayOdds = awayOutcome.price;

                            const oddsInfo = {
                                name: `${bookmakerTitle}`,
                                value: `Home: ${teamOdds.home_team} -> ${homeOdds}\nAway: ${teamOdds.away_team} -> ${awayOdds}`,
                            };

                            oddsFields.push(oddsInfo);
                            mainOdds = true;
                        }
                    });
            });
            message.channel.createMessage({
                embed: {
                  title: `Odds for ${sportDesc} - ${teamOdds.home_team} vs ${teamOdds.away_team}\nDate: ${formattedDate} EST`,
                  fields: oddsFields,
                  color: 2123412,
                },
              });
    } 
    catch (error) {
        console.error(error);
    }
});
