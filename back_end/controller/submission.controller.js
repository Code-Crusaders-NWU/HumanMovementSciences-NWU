//Call SubmissionService
const SubmissionService = require('../services/submission.services')

//Export the submit function so it can be used in the Route handler for an API request
exports.submit = async(req, res, next) => {
    try {
        //Extracts submission information from the API request body
        const {assignm_Num, stu_Email, submission_Date, content, grade, feedback} = req.body;

        //Await confirmation of successful submission
        const success = await SubmissionService.createSubmission(assignm_Num, stu_Email, submission_Date, content, grade, feedback);

        res.json({status: true, success: 'Submitted successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during the submission process', error: error.message});
        next(error);
    }
}

//Export the view submissions function so it can be used in the Route handler for an API request
exports.viewAll = async(req, res, next) => {
    try {
        //Extract student's email from the API request body
        const { stu_Email } = req.body;

        //Await the result of viewAllSubmissions function
        const submissions = await SubmissionService.viewAllSubmissions(stu_Email);

        if (submissions) {
            res.json({status: true, submissions});
        } else {
            res.status(404).json({status: false, message: 'No submissions found for the specified student'});
        }
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({status: false, message: 'An error has occurred during submission retrieval'});
        next(error);
    }
  }
