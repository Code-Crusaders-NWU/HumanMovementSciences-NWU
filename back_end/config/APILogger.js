const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;

const logFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logAPI = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({filename: 'logs/api.log'})
    ]
});

module.exports = logAPI;