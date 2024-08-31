const router = require('express').Router();
const SubmissionController = require('../controller/submission.controller');

//When the assign API is called
router.post('/submission', SubmissionController.submit);

//When the viewAll API is called
router.get('/submission', SubmissionController.viewAll);

//When the grade API is called
router.patch('/grade-submission', SubmissionController.grade);

//Export the router
module.exports = router;