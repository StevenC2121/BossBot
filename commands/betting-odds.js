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

        if (Array.isArray(sportsData)) {
            console.log(`Successfully got ${sportsData.length} sports.`);

            console.log("Here are the sports:");

            sportsData.forEach((sport) => {
                console.log(`Sport: ${sport.title}`);
                console.log(`Description: ${sport.description}`);
                console.log(`Group: ${sport.group}`);
                console.log(`Active: ${sport.active}`);
                console.log(`Has Outrights: ${sport.has_outrights}`);
                console.log("----------------------------------");
            });
        } 
        else {
            console.log('No sports data found in the response.');
        }
    } 
    catch (error) {
        console.error(error);
    }
});
