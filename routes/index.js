var express = require('express');

var router = express.Router();
var path = require("path");

router.get('/', function(req, res) {
  url = 'http://localhost/maand.html';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var key;
      var json = { key : ""};

      $('#agendaitem').filter(function(){
        console.log('find tag: ');

        var data = $(this);
        console.log('res: '+ data);

        key= data.children().first().text();
        json.key = key;
      })

    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
  })
});

module.exports = router;