require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var requireDir = require('require-dir');
var routes = requireDir('./routes',{camelcase: true});
var config = require('config');

var app = express();

for (var i in routes)
  app.use('/', routes[i]);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js'))
        require(__dirname + '/models/' + filename)
});

app.listen(app.get('port'), function() {
  if(process.env.NODE_ENV == 'development'){
    console.log("Running at: " +
        process.env.LOCAL_HOST + ':' +
        app.get('port') +
        '\ndb_uri: ' + config.get('db_uri'));
  }
});

module.exports = app;