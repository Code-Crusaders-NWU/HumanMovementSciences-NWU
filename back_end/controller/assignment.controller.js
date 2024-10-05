//Call AssignmentService
const AssignmentService = require('../services/assignment.services');
const { verifyLecturer } = require('../services/lecturer.services');
const logger = require('../config/logger')


//Export the assign function so it can be used in the Route handler for an API request
exports.assign = async(req, res, next) => {
    try{
        //Extracts assignment information from the API request body
        const{assignm_Num, assignm_Date,  lec_Email, grade, due_date, title, description} = req.body;

        //Await confirmation of successful assignment upload
        const success = await AssignmentService.createAssignment(assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description);
        logger.assignmentLogger.log('info','Assignment uploaded successfully');
        res.json({status: true, success: 'Assignment uploaded successfully'});
    } catch (error) {
        logger.assignmentLogger.log('error',error.message);
        res.status(500).json({success: false, message: 'An error has occurred during assignment upload', error: error.message });
        next(error); 
    }
}


//Export the delete function so it can be used in the Route handler for an API request
exports.delete = async(req, res, next) => {
    try {
        //Extract assignment number from the API request body
        const { assignm_Num } = req.body;

        //Await confirmation of successful assignment deletion
        const success = await AssignmentService.deleteAssignment(assignm_Num);

        
        logger.assignmentLogger.log('info',success.message);
        res.json({status: true, success: 'Assignment deleted successfully'});            
        
    } catch (error) {
        if(error.message === "Specified assignment not found") {
            logger.assignmentLogger.log('info','Specified assignment not found')
            return res.status(404).json({success: false, message: 'Specified assignment not found'});
        }

        logger.assignmentLogger.log('error',error.message)
        res.status(500).json({success: false, message: 'An error has occurred during assignment deletion', error: error.message});
        next(error);
    }
}

//Export the view assignments function so it can be used in the Route handler for an API request
exports.viewAll = async(req, res, next) => {
    try {
        //Extract lecturer's email from the API request body
        const {lec_Email} = req.query;

        //Call verifyLecturer function from assignment.services
        verifyLecturer();

        //Await the result of viewAllAssignments function
        const assignments = await AssignmentService.viewAllAssignments(lec_Email);

        //Return assignments
        logger.assignmentLogger.log('info','Showing all assignments from email')
        return res.json({ status: true, assignments });

    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.assignmentLogger.log('error',error.message)
        res.status(500).json({status: false, message: 'An error has occurred during assignment retrieval'});
        next(error);
    }
  }

  exports.dueAssignments = async(req, res, next) => {
    try {
        const {stu_Email} = req.user;
        const assignments = await AssignmentService.getDueAssignments(stu_Email);

        logger.assignmentLogger.log('info', 'Due assignments fetched successfully');
        return res.json({status: true, assignments});
    } catch (error) {
        logger.assignmentLogger.log('error', error.message);
        res.status(500).json({status: false, message: 'An error has occurred while fetching due assignments'});
        next(error);
    }
  }

  exports.dueToday = async (req, res, next) => {
    try {
        const {stu_Email} = req.user;

        // Get the assignments due today
        const assignments = await AssignmentService.getAssignmentsDueToday(stu_Email);

        // Log success and return the assignments
        logger.assignmentLogger.log('info', 'Assignments due today fetched successfully');
        return res.json({ status: true, assignments });

    } catch (error) {
        // Log error and return server error
        logger.assignmentLogger.log('error', error.message);
        res.status(500).json({ status: false, message: 'An error occurred while fetching assignments due today' });
        next(error);
    }
};