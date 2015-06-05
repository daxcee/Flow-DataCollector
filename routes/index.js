var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require("path");
var request = require('request');
var $ = require('cheerio');
var config = require('config');

router.get('/', function(req, res) {
    res.sendFile('events-sample.html', { root: path.join(__dirname, '../public') });
});

router.get('/scrape', function(req, res) {
    url =  config.get('local_path') +'/events-sample.html';

    request(url, function(err, resp, html){
        if(err) {
          throw err;
        } else {
            var parsedHTML = $.load(html);
            var items = [];
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
                  venue: $(item).children().last().text(),
                  city: $(item).children().last().text()
                };
                items.push(eventItem);
                console.log("parsed item: " + eventItem);
          });
        }

        res.end(JSON.stringify(items, null, 4));

        fs.writeFile('./data/scraped-events.json',JSON.stringify(items, null, 4), function(err){
                if(err)
                    throw err;
        });

  })
});

module.exports = router;