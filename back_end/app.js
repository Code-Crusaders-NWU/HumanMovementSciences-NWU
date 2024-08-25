const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers');
const video_router = require('./routers/video.routers');
const lecturer_router = require('./routers/lecturer.router');
const student_router = require('./routers/student.router');
const submission_router = require('./routers/submission.router');

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(bodyParser.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/', userRouter);
app.use('/', assignment_router);
app.use('/', video_router);
app.use('/', lecturer_router);
app.use('/', student_router);
app.use('/', submission_router);

module.exports = app;
