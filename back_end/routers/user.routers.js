
const router = require('express').Router();
const UserController = require("../controller/user.controller")


router.post('/signup',UserController.register);  //When the signup api is called the register function is called from the user.coltroller.js file

//Work in progress
//router.post('/login',UserController.register);
//Work in progress

module.exports = router; //Export router so it can be used by the main application file