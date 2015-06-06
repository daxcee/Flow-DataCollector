require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    redirectURL:process.env.REDIRECT_URL,
    resources:
        [
            process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:'00 30 23 * * 1-7' //Runs every day of the week on @ 6:13 AM,
};