require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    scrapeResources:
        [
            'https://flow-scraper.herokuapp.com/events-sample.html'
        ]
};