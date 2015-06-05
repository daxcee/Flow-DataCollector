var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require("path");
var request = require('request');
var $ = require('cheerio');
var config = require('config');
var pretty = require('../utils/pretty');
var cronJob = require('cron').CronJob;
var moment = require('moment');

router.get('/', function(req, res) {
    res.sendFile('events-sample.html', { root: path.join(__dirname, '../public') });
});

/**
 * Cron job runs every minute, for now, for production properly setup schedule.
 * More info: http://crontab.org
*/
new cronJob('*/60 * * * * *', function() {
    url = config.get('scrapeResources')[0];
        var items = [];
    console.log(moment().format() + ' cron job for: ' + url);
    request(url, function(err, resp, html){
        if(err) {
            throw err;
        } else {
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
        items = pretty.print(items);
        var filename = 'scraped-events-' + moment().format() + '.json';
        fs.writeFile('./data/' + filename, items, function(err){
            if(err)
                throw err;
            else
                console.log('File written at: /data/' + filename)
        });
    });
},function () {
    //postExecution
}, true,
    "Europe/Amsterdam"
);

module.exports = router;