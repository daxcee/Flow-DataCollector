var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require("path");
var request = require('request');
var $ = require('cheerio');
var config = require('config');
var pretty = require('../utils/pretty');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var mkdirp = require('mkdirp');

router.get('/', function(req, res) {
    res.sendFile('m.html', { root: path.join(__dirname, '../public') });
});

/***
 * The the best abilities try to hold-on etiquette, so we don't aggrevate any one
 * Food for thought on web-scraping etiquette :{@link http://stackoverflow.com/questions/2022030/web-scraping-etiquette}
 */

// set some defaults
request = request.defaults({
    jar: true,                 // save cookies to jar
    rejectUnauthorized: false,
    followAllRedirects: true   // allow redirections
});

var headers = {
    headers: {
        'User-Agent': config.get('userAgents')[0]
    }
};

/**
 * Cron job runs every minute, for now, for production properly setup schedule.
 * More info: http://crontab.org
*/
new CronJob(config.get('cronTime'), function(next, res, req) {
        url = config.get('scrapeResources')[1];
        console.log(moment().format() + ' cron job for: ' + url);
        request.get(url,headers, function(err, resp, html){
            if(err) {
                throw err;
            } else {
                var items =[];
                var parsedHTML = $.load(html);
                var eventItem = {
                    id: '',
                    date: '',
                    title: '',
                    venue: '',
                    city: ''
                };
                parsedHTML('.agendaitem').map(function(i, item) {
                    var id = $(item).find('.party').attr('href');
                    var IdOffset = id.indexOf("=");
                    if(IdOffset != -1)
                        id = id.substring(IdOffset+1, id.length);

                    var eventDate = '';
                    if($(item).attr('title'))
                        eventDate = String($(item).attr('title'));
                    var dateOffset = eventDate.indexOf(' ');
                    if(dateOffset != -1)
                        eventDate = eventDate.substring(dateOffset+1, eventDate.length);

                    var eventItem = {
                        id: id,
                        date: eventDate,
                        title: $(item).find('.party').text(),
                        venue: $(item).children().first().next().next().next().text(),
                        city: $(item).children().first().next().next().next().next().next().text()
                    };
                    items.push(eventItem);
                });
            }
            next(pretty.print(items));
        });
    },function (items ) {
        var filename = 'scraped-events-' + moment().format() + '.json';
        var path = './data/scraped/';
        mkdirp(path, function(err) {
            if(err)
                throw err;
            else {
                fs.writeFile(path + filename, items, function (err) {
                    console.log('File written at: ' + path);
                });
            }
        });
    }, true,
    "Europe/Amsterdam"
);

module.exports = router;