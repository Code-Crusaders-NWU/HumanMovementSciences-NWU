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

const videoLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/video.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/video-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

const studentLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/student.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/student-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

const lecturerLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/lecturer.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/lecturer-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

const submissionLogger = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/submission.log',
            level : 'info',
            format: format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: 'logs/submission-error.log',
            level : 'error',
            format: format.combine(format.timestamp(),format.json())   
        })
    ]
})

module.exports = {
    userLogger,
    assignmentLogger,
    videoLogger,
    studentLogger,
    lecturerLogger,
    submissionLogger
};