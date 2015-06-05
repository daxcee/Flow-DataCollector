require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    scrapeResources:
        [
            'http://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_PORT + '/events-sample.html'
        ],
    cronTime:'* * * * * *'//Runs every second
    };