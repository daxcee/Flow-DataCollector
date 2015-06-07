require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME,
    redirectURL: 'https://' + process.env.REDIRECT_URL,
    resources:
        [
            'http://' + process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:'00 13 06 * * 1-7' //Runs every day of the week on @ 6:13 AM,
};