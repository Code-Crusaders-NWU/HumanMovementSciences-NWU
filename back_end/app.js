const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers')
const video_router = require('./routers/video.routers')
const student_router = require('./routers/student.router');
const lecturer_router = require('./routers/lecturer.router');
const app = express();

app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', assignment_router);
app.use('/', video_router);
app.use('/', student_router);
app.use('/', lecturer_router);
module.exports = app;