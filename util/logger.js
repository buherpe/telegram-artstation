const winston = require('winston');
const {telegram} = require('./telegram');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({format: 'HH:mm:ss YYYY-MM-DD'}),
    // winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(({level, message, timestamp}) => {
      telegram.sendLogMessage(`[${timestamp}]${level}: ${message}`);
      return `[${timestamp}]${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

exports.logger = logger;
