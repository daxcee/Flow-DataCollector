require('dotenv').load();

module.exports = {
    db_uri: 'mongodb://' + process.env.LOCAL_HOST + ':' + process.env.LOCAL_DBPORT + '/' + process.env.DB_NAME,
    redirectURL: 'https://' + process.env.REDIRECT_URL,
    resources:
        [
            'http://' + process.env.RESOURCE_0
        ],
    outputPath: './data/scraped/',
    cronTime:'* /60 * * * *' //Runs every second
};