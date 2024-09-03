const router = require('express').Router();
const SubmissionController = require('../controller/submission.controller');

//When the assign API is called
router.post('/submission', SubmissionController.submit);

//When the viewAll API is called
router.get('/submission', SubmissionController.viewAll);

//Route for downloading marks
router.get('/submission/download_marks', SubmissionController.downloadMarks);

//Route for downloading assignment spesific marks
router.get('/download_marks/:assignmentNumber', SubmissionController.downloadSpesificMarks);

//When the grade_submission API is called
router.patch('/submission/grade_submission', SubmissionController.grade);

//When the provide_feedback API is called
router.patch('/submission/provide_feedback', SubmissionController.feedback);

//Export the router
module.exports = router;