const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers');
const video_router = require('./routers/video.routers');
const lecturer_router = require('./routers/lecturer.router');
const student_router = require('./routers/student.router');
const submission_router = require('./routers/submission.router');
const aws_router = require('./routers/aws.router.js');
// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

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
