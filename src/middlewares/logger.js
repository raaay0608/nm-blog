import winston from 'winston'

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'verbose-file',
      filename: 'log/verbose.log',
      level: 'verbose'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'log/info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'warn-file',
      filename: 'log/warn.log',
      level: 'warn'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'log/error.log',
      level: 'error'
    })
  ]
})

export default logger
