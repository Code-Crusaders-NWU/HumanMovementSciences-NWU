//Call AssignmentService
const AssignmentService = require('../services/assignment.services');

//Export the assign function so it can be used in the Route handler for an API request
exports.assign = async(req, res, next) => {
    try{
        //Extracts assignment information from the API request body
        const{assignm_Num, assignm_Date, assignm_Feedback, stu_Email, lec_Email, grade, due_date} = req.body;

        //Await confirmation of successful assignment upload
        const success = await AssignmentService.createAssignment(assignm_Num, assignm_Date, assignm_Feedback, stu_Email, lec_Email, grade, due_date);

        res.json({status: true, success: 'Assignment uploaded successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
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

        if (success) {
            res.json({status: true, success: 'Assignment deleted successfully'});            
        } else {
            res.status(404).json({success: false, message: 'Specified assignment not found'});
        } 
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during assignment deletion'});
        next(error);
    }
}