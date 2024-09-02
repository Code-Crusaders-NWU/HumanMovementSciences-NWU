//Call SubmissionService
const SubmissionService = require('../services/submission.services')
const { verifyStudent } = require('../services/student.services');
const logger = require('../config/logger');

//Export the submit function so it can be used in the Route handler for an API request
exports.submit = async(req, res, next) => {
    try {
        //Extracts submission information from the API request body
        const {assignm_Num, stu_Email, submission_Date, content, grade, feedback} = req.body;

        //Await confirmation of successful submission
        const success = await SubmissionService.createSubmission(assignm_Num, stu_Email, submission_Date, content, grade, feedback);
        logger.submissionLogger.log('info', 'Submitted successfully');
        res.json({status: true, success: 'Submitted successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during the submission process', error: error.message});
        next(error);
    }
}

//Export the view all submissions function so it can be used in the Route handler for an API request
exports.viewAll = async(req, res, next) => {
    try {
        //Extract student's email from the API request body
        const {stu_Email} = req.body;

        //Call verifyStudent from student.services
        verifyStudent();

        //Await the result of viewAllSubmissions function
        const submissions = await SubmissionService.viewAllSubmissions(stu_Email);
        logger.submissionLogger.log('info', 'Submitted successfully');

        //Return submissions
        return res.json({ status: true, submissions });

    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({status: false, message: 'An error has occurred during submission retrieval'});
        next(error);
    }
  }

  //Export the view downloadMarks function so it can be used in the Route handler for an API request
  exports.downloadMarks = async (req, res, next) => {
    try {

        //get the path to the csv file
        const filePath = await SubmissionService.getAllMarks();
        logger.submissionLogger.log('info', 'Submitted successfully');

        //send the file as a download
        res.download(filePath, 'marks.csv', (err) => {

            if (err) {
               res.status(500).json({ status: false, message: 'Error occured during download', error: err.message}); 
               next(err);
            }

        });

    } catch (error) {
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({ status: false, message: 'Error occured during download', error: error.message}); 
        next(error);
    }
  };

  //Export the grade function so it can be used in the Route handler for an API request
  exports.grade = async(req, res, next) => {
    try {
        //Extracts submission information from the API request body
        const {assignm_Num, stu_Email, grade} = req.body;

        //Await confirmation of successful submission grade assignment
        const success = await SubmissionService.gradeSubmission(assignm_Num, stu_Email, grade);
        logger.submissionLogger.log('info', 'Submitted successfully');
        res.json({status: true, success: 'Submission graded successfully'});
    } catch(error) {
        //Respond with server error (Status code: 500)
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during the grade assignment process', error: error.message});
    }
  }


  //Export the feedback function so it can be used in the Route handler for an API request
  exports.feedback = async(req, res, next) => {
    try {
        //Extracts submission information from the API request body
        const {assignm_Num, stu_Email, feedback} = req.body;

        //Await confirmation of successful submission feedback assignment
        const success = await SubmissionService.assignFeedback(assignm_Num, stu_Email, feedback);
        logger.submissionLogger.log('info', 'Submitted successfully');
        res.json({status: true, success: 'Submission feedback assigned successfully'});
    } catch(error) {
        //Respond with server error (Status code: 500)
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during the assignment feedback process', error: error.message});
    }
  }