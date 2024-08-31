const router = require('express').Router();
const SubmissionController = require('../controller/submission.controller');

//When the assign API is called
router.post('/submission', SubmissionController.submit);

//When the viewAll API is called
router.get('/submission', SubmissionController.viewAll);

//Route for downloading marks
router.get('/submission/download_marks', SubmissionController.downloadMarks);

//Export the router
module.exports = router;