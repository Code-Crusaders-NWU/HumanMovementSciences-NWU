const {createLogger, transports, format} = require('winston');
require('winston-daily-rotate-file');

//function for logging

const userLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/users.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/users-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

const assignmentLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/assignments.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/assignments-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

module.exports = {userLogger,
    assignmentLogger
};