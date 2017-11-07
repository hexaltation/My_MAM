var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var login = require('./routes/login');
var media = require('./routes/media');
var admin = require('./routes/admin');
var ingest = require('./routes/ingest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use ('/src', express.static(path.join(__dirname, '../my_MAM-src')));
app.use ('/img', express.static(path.join(__dirname, './public/images/')));
app.use ('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
app.use ('/js-cookie', express.static(path.join(__dirname, 'node_modules/js-cookie/src/')));
app.use ('/vjs', express.static(path.join(__dirname, 'node_modules/video.js/dist/')));

app.use('/', login);
app.use('/logout', login);
app.use('/media', media);
app.use('/admin', admin);
app.use('/ingest', ingest);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err.message});
});

module.exports = app;
