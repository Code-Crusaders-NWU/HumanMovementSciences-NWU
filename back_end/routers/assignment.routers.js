const router = require('express').Router();
const AssignmentController = require('../controller/assignment.controller');

//When the assign API is called
router.post('/assignment', AssignmentController.assign);

//When the delete API is called
router.delete('/assignment', AssignmentController.delete);

//Export the router so it accessible by the main application
module.exports = router;