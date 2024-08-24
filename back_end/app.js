const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers');
const video_router = require('./routers/video.routers');
const student_router = require('./routers/student.router');

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
app.use('/', student_router);

module.exports = app;
