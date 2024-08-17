const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.route');
const app = express();
app.user(bodyParser.json());

app.use('/', userRouter);

module.exports = app;