var request = require('request');
var config = require('config');
var mongoose = require('mongoose');
var conn = mongoose.createConnection(config.get('db_uri'),{ server: { poolSize: 4 }});
var Event = conn.model('Event');
var random_useragent = require('random-useragent');
var djg = require('../cronjobs/cronjob_djg');

module.exports = {

    getEvents: function() {

        var module = {};

        module.request = request.defaults({
            jar: true, // Save cookies to jar
            rejectUnauthorized: false,
            followAllRedirects: true
        });

        /***
         * To the best of abilities try to hold-on to etiquette, so we don't aggravate anyone ;)
         * Food for thought on web-scraping etiquette:
         * {@link http://stackoverflow.com/questions/2022030/web-scraping-etiquette}
         */
        var options = {
            url: config.get('resources')[0],
            headers: {
                'accept-charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                'accept-language': 'en-US,en;q=0.8,nl-NL,nl;q=0.8',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': random_useragent.getRandom() // We should identify ourselfs properly, don't want to ... for now :p
                // Resource1 has no gzip support, that's dumb ;p, they should enable it as it
                // improves transfer speed and do not consume too much bandwidth.
                //'accept-encoding': 'gzip,deflate'
            }
        };


        djg.scrape(options);
    }
};
