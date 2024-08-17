const router = require('express').Router();
const AssignmentController = require('../controller/assignment.controller');

//When the assign API is called
router.post('/assignment', AssignmentController.assign);

//router.post

//Export the router so it accessible by the main application
module.exports = router;