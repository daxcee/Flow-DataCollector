require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    scrapeResources:
        [
            'https://flow-scraper.herokuapp.com/events-sample.html'
        ],
    cronTime:'00 59 5 * * 1-7'//Runs every day of the week on @ 5:59 AM
};