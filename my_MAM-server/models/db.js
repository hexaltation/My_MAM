var mongoose = require('mongoose');
var config = require('../config/config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.database, {useMongoClient: true,});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

exports.db;