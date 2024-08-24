const router = require('express').Router();
const LecturerController = require('../controller/lecturer.controller');

//When the lecturerCreate API is called
router.post('/lecturer', LecturerController.lecturerCreate);

//When the delete API is called
router.delete('/lecturer', LecturerController.delete);

//Export the router so it is accessible by the main application
module.exports = router;