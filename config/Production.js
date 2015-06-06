require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME,
    redirectURL:process.env.REDIRECT_URL,
    resources:
        [
            process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:'00 45 23 * * 1-7' //Runs every day of the week on @ 6:13 AM,
};