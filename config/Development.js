require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    redirectURL:process.env.REDIRECT_URL,
    resources:
        [
            process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:'*/10 * * * * *' //Runs every second
    };