require('../models/event')();

var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request');
var $ = require('cheerio');
var config = require('config');
var pretty = require('../utils/pretty');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var conn = mongoose.createConnection(config.get('db_uri'),{ server: { poolSize: 4 }});
var Event = conn.model('Event');
var random_useragent = require('random-useragent');
var proxies = require('../utils/proxies');

router.get('/', function(req, res) {
    res.writeHead(302, {'location': config.get('redirectURL')});
    res.end();
});

router.get('/proxies', proxies.getProxies);

/***
 * To the best of abilities try to hold-on to etiquette, so we don't aggravate anyone ;)
 * Food for thought on web-scraping etiquette:
 * {@link http://stackoverflow.com/questions/2022030/web-scraping-etiquette}
 */
request = request.defaults({
    jar: true, // Save cookies to jar
    rejectUnauthorized: false,
    followAllRedirects: true
});
var options = {
    url: config.get('resources')[0],
    proxy:'',
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
/**
 * Cron job runs every minute, for now, for production properly setup schedule.
 * More info: http://crontab.org
*/
new CronJob(config.get('cronTime'), function(next) {
        console.log(moment().format() + ' cron job for: ' + options.url);

        request(config.get('proxyRequest'), function(error, response){
            var proxies = [];
            var ip, port;
            if(error) throw error;
            else {
                var data = JSON.parse(response.body);
                console.log('use proxy: ' + data[0].ip);
                ip = data[0].ip;
                port = data[0].port;
            }
            options.proxy = 'http://' + ip + ':' + port;
            request(options, function(err, res, body){

                if(err) {
                    throw err;
                } else { // DOM traversal: https://github.com/cheeriojs/cheerio#api
                    var items =[];
                    var parsedHTML = $.load(body);
                     console.log('res:' + body);

                    parsedHTML('.agendaitem').map(function(i, item) {
                        var eventDate = '';
                        if($(item).attr('title')) {
                            eventDate = String($(item).attr('title'));
                            var dateOffset = eventDate.indexOf(' ');
                            if (dateOffset != -1)
                                eventDate = eventDate.substring(dateOffset + 1, eventDate.length);
                        }
                        var newEventItem = new Event({
                            pid: '',
                            date: eventDate,
                            title: $(item).find('.party').text(),
                            venue: $(item).children().eq(3).text(),
                            city: $(item).children().eq(5).text(),
                            country: $(item).children().eq(6).text()
                        });
                        newEventItem.save();
                        items.push(newEventItem);
                    });
                }
                next(pretty.print(items));
            })

        });

    },function (items ) {
        var path = config.get('outputPath');
        mkdirp(path, function(err) {
            if(err)
                throw err;
            else {
                var filename = 'scraped-events-' + moment().format() + '.json';
                fs.writeFile(path + 'scraped-events-' + moment().format() + '.json', items, function (err) {
                    console.log('File written: ' + path + filename);
                });
            }
        });
    }, true,
    "Europe/Amsterdam"
);

module.exports = router;