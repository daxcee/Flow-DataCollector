require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME,
    redirectURL: 'https://' + process.env.REDIRECT_URL,
    resources:
        [
            'http://' + process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:process.env.CRON_TIME, ///Runs at specific time
    app_url: 'https://' + process.env.APP_URL
};