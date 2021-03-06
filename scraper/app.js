// app.js
//

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var exporting = require('./routes/exporting');
var exportDynamo = require('./routes/exportDynamo');

var parseBikesModule = require('./modules/parsebikes.js');

var memwatch = require('memwatch');

var config = require('./config');

var app = express();

// console.log('port: ', JSON.stringify(config));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/exporting', exporting);
app.use('/dynamo', exportDynamo);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

setInterval(parseBikesModule.parseBikes, config.scrapeInterval);
/* TODO:
get rid of interval in favour of timeout, otherwise you may get 
simultaneous calls and simialar problems
*/

memwatch.on('leak', function(info) {
  console.log('on leak: ', info);
  });

memwatch.on('stats', function(stats) {
  console.log('on stats: ', stats);
  });

module.exports = app;
