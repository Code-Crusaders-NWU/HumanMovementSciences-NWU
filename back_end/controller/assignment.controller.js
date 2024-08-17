//Call AssignmentService
const AssignmentService = require('../services/assignment.services');

//Export the assignment function so it can be used in the Route handler for an API request
exports.assign = async(req, res, next) => {
    try{
        //Extracts assignm_Num from the API request body
        const{assignm_Num, assignm_Date, assignm_Feedback, stu_Num, lec_Num, grade, due_date} = req.body;

        //Await confirmation of successful assignment opload
        const success = await AssignmentService.assignment(assignm_Num, assignm_Date, assignm_Feedback, stu_Num, lec_Num, grade, due_date);

        res.json({status: "true", success: 'Assignment uploaded successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during assignment upload', error: error.message });
        next(error); 
    }
}