require('../models/event')();

var express = require('express');
var router = express.Router();
var config = require('config');
var collector = require('../collectors/managers/collectorManager');

router.get('/', function(req, res) {
    res.writeHead(302, {'location': config.get('redirectURL')});
    res.end();
});

collector.getEvents();

module.exports = router;