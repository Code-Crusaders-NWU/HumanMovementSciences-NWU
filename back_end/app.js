const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers');
const video_router = require('./routers/video.routers');
const lecturer_router = require('./routers/lecturer.router');
const student_router = require('./routers/student.router');
const submission_router = require('./routers/submission.router');
const aws_router = require('./routers/aws.router.js');
const morgan = require('morgan');
const winston = require('winston');
const logAPI = require('./config/APILogger');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(morgan('combined', {
    stream: {
        write: (message) => logAPI.info(message.trim())
    }
}));

//Middleware to log request details and measure response time
app.use((req, res, next) => {
    const start = Date.now(); //Start time

    //After response is finished, log response time
    res.on('finish', () => {
        const duration = Date.now() - start;
        logAPI.info(`Method: ${req.method}, URL: ${req.originalUrl}, Status: ${res.statusCode}, Time: ${duration}ms`);
    });

    next();
});

//Log errors
app.use((err, req, res, next) => {
    logAPI.error(`Error: ${err.message}, URL: ${req.originalUrl}, Method: ${req.method}`);
    res.status(500).json({ success: false, message: 'Server Error' });
});

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(cors()); //Allows all routes to use backend

app.use(bodyParser.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api/', userRouter);
app.use('/api/', assignment_router);
app.use('/api/', video_router);
app.use('/api/', lecturer_router);
app.use('/api/', student_router);
app.use('/api/', submission_router);
app.use('/api/', aws_router);
module.exports = app;
