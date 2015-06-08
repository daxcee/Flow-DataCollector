var request = require('request');
var $ = require('cheerio');
var config = require('config');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var mongoose = require('mongoose');
var conn = mongoose.createConnection(config.get('db_uri'),{ server: { poolSize: 4 }});
var Event = conn.model('Event');

module.exports = {
    scrape: function(options){
        /**
         * Cron job runs every minute, on dev, for production based on given date.
         * More info: http://crontab.org
         */
        new CronJob(config.get('cronTime'), function(next) {
                console.log(moment().format() + ' cron job for: ' +  options.url);
                request(options, function(err, res, body){
                    if(err) {
                        throw err;
                    } else { // DOM traversal: https://github.com/cheeriojs/cheerio#api
                        var items =[];
                        var parsedHTML = $.load(body);
                        parsedHTML('.agendaitem').map(function(i, item) {
                            var eventDate = '';
                            if($(item).attr('title')) {
                                eventDate = String($(item).attr('title'));
                                var dateOffset = eventDate.indexOf(' ');
                                if (dateOffset != -1)
                                    eventDate = eventDate.substring(dateOffset + 1, eventDate.length);
                            }
                            var title =  $(item).find('.party').text();
                            //Check if item isn't already in datastore.
                            Event.find({title : title}, function (err, docs) {
                                if (!docs.length){
                                    console.log('Save event: ', eventDate + ' - ' + title);
                                    var newEventItem = new Event({
                                        pid: '',
                                        date: eventDate,
                                        title: title,
                                        venue: $(item).children().eq(3).text(),
                                        city: $(item).children().eq(5).text(),
                                        country: $(item).children().eq(6).text()
                                    });
                                    newEventItem.save();
                                }else{
                                    console.log('Event already exists, skipping: ', eventDate + ' - ' + title);
                                }
                            });
                        });
                    }
                });
            },  true,
            "Europe/Amsterdam"
        );
    }
};
