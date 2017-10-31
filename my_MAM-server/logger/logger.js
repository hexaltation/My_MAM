var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: __dirname + '/../log/filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: __dirname + '/../log/filelog-error.log',
      level: 'error'
    })
  ]
});

module.exports.logger = logger;