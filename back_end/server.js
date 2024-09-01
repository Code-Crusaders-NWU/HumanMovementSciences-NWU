const express = require('express');

//Called automatically when server initiates
const database = require('./config/database');
const userModel = require('./models/user.model');
const app = require('./app');

app.get('/', (req, res) => {
    res.json({message : 'Code Crusaders HMS BACKEND'})               
});


//Started a Local Server on Port 8080
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log("Server started on port => 8080");
});


//To better close the server
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
 