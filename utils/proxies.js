var request = require('request');
var $ = require('cheerio');
var fs = require('fs');
var mkdirp = require('mkdirp');
var config = require('config');

var options = {
    url: config.get('proxyResources')[0]
};

module.exports = {
    getProxies:  function callback(err, res) {

        var proxies = [];
        var country = config.get('proxyCountry');
        if(country)
            options.url += "?country-" + country;

        request(options, function(err,resp,body){
            if (!err && resp.statusCode == 200) {
                var parsedHTML = $.load(body);
                var proxyItem = {ip:'', port:''};

                parsedHTML('#tbl_proxy_list').find('tr').map(function(i, item) {
                    var ip = $(item).find('.row_proxy_ip').contents().text();
                    var port = $(item).children().eq(1).text().trim();
                    if(ip.length && port.length){
                        proxyItem.ip = ip;
                        proxyItem.port = port;
                        proxies.push(proxyItem)
                    }
                });
            }
            var outputPath = './tmp/';
            var outputFile = 'proxies.json';
            mkdirp(outputPath, function(err) {
                if(err)
                    throw err;
                else {
                    fs.writeFile(outputPath + outputFile, JSON.stringify(proxies,null,4), function (err) {
                        if(err) throw err;
                        console.log('File written: ' + outputPath + outputFile);
                    });
                }
            });
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(proxies),null,2);
        });
    }
};