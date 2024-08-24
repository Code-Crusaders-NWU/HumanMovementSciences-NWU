const router = require('express').Router();
const StudentController = require('../controller/student.controller');

//When the studentCreate API is called
router.post('/student', StudentController.studentCreate);

//When the delete API is called
router.delete('/student', StudentController.delete);

//Export the router so it is accessible by the main application
module.exports = router;