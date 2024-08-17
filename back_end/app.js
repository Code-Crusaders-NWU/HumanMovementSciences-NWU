const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.routers');
const assignment_router = require('./routers/assignment.routers')
const app = express();

app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', assignment_router);
module.exports = app;