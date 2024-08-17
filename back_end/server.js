const express = require('experess');

//Called automatically when server initiates
const database = require('./config/database');
const userModel = require('./model/user.model');
const app = require('./app');

app.get('/', (req, res) => {
    res.send("")                //Edit
});


//Started a Local Server on Port 8000
app.listen(8000, () => {
    console.log("Server started on port => 8000");
});