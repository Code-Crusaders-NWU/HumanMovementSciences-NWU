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
        verifyStudent(stu_Email);

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

  //Export the downloadMarks function so it can be used in the Route handler for an API request
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

    //Export the downloadSpesificMarks function so it can be used in the Route handler for an API request
    exports.downloadSpesificMarks = async (req, res, next) => {
        try {
    
            const {assignmentNumber} = req.params;

            //get the path to the csv file
            const filePath = await SubmissionService.getAssignmentMarks(assignmentNumber);
    
            //send the file as a download
            res.download(filePath, 'marks.csv', (err) => {
    
                if (err) {
                   res.status(500).json({ status: false, message: 'Error occured during download', error: err.message}); 
                   next(err);
                }
    
            });
    
        } catch (error) {
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

  exports.submissionCount = async (req, res, next) => {
    try {

        //Extract student's email from the request
        const stu_Email = req.user;

        if (!stu_Email) {
            return res.status(400).json({ status: false, message: 'Student email not found in request'});
        }

        //Get the count of submissions from getSubmissionCount
        const submissionCount = await SubmissionService.getSubmissionCount(stu_Email);

        //Log and return the count
        logger.submissionLogger.log('info', 'Submission count retrieved successfully');
        return res.status(200).json({ status: true, submissionCount });
    } catch (error) {
        //Log error and return server error response
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({ status: false, message: 'An error occurred while retrieving submission count' });
        next(error);
    }
};


exports.getUngradedSubmissions = async (req, res, next) => {

    try {
        //Extract lecturer's email from the request
        const { lec_Email } = req.user;

        //Call the service to get ungraded submissions
        const ungradedSubmissions = await SubmissionService.getUngradedSubmissions(lec_Email);

        if (!ungradedSubmissions || ungradedSubmissions.length === 0) {
            return res.status(404).json({ status: false, message: 'No ungraded submissions found for this lecturer' });
        }

        //Log and return the ungraded submissions
        logger.submissionLogger.log('info', 'Ungraded submissions retrieved successfully');
        return res.status(200).json({ status: true, ungradedSubmissions });
    } catch (error) {
        //Log the error and return a server error response
        logger.submissionLogger.log('error', error.message);
        res.status(500).json({ status: false, message: 'An error occurred while retrieving ungraded submissions' });
        next(error);
    }
};


exports.getSubmissionsByAssignmNum = async (req, res, next) => {
    try {
        const {assign_Num} = req.params;
        const submissions = await SubmissionService.getSubmissionsByAssignmNum(assign_Num);
        res.status(200).json({ status: true, submissions });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
        next(error);
    }
};

