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
    res.sendFile('events-sample.html', { root: path.join(__dirname, '../public') });
});

/**
 * Cron job runs every minute, for now, for production properly setup schedule.
 * More info: http://crontab.org
*/
new CronJob(config.get('cronTime'), function(next, res, req) {
        url = config.get('scrapeResources')[0];
        console.log(moment().format() + ' cron job for: ' + url);
        request(url, function(err, resp, html){
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
                parsedHTML('.eventItem').map(function(i, item) {
                    var id = $(item).find('.party').attr('href');
                    var offset = id.indexOf("=");
                    if(offset != -1)
                        id = id.substring(offset+1, id.length);
                    var eventItem = {
                        id: id,
                        date: $(item).attr('date'),
                        title: $(item).find('.party').text(),
                        venue: $(item).children().first().next().text(),
                        city: $(item).children().last().text()
                    };
                    items.push(eventItem);
                });
            }
            next(pretty.print(items));
        });
    },function (items ) {
        var filename = 'scraped-events-' + moment().format() + '.json';
        var path = './data/scraped/';
        console.log('postExcec called');

        //postExecution
        mkdirp(path, function(err) {
            if(err)
                throw err;
            // path was created unless there was error
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