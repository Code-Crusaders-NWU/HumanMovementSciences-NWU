//Call StudentService
const StudentService = require('../services/student.services');
const logger = require('../config/logger');

//Export the studentCreate function so it can be used in the Route handler for API requests.
exports.studentCreate = async(req, res, next) => {
    try {
        //Extracts the student information from the body of n API request
        const{stu_Email, stu_Name, stu_Surname} = req.body;

        //Await confirmation of succesful student creation
        const success = await StudentService.createStudent(stu_Email, stu_Name, stu_Surname);
        logger.studentLogger.log('info', 'Student information uploaded successfully');
        res.json({status: true, success: 'Student information uploaded successfully'});
    } catch (error) {
        //Respomd with server error (Status code: 500)
        logger.studentLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during the student information upload process', error: error.message});
        next(error);
    }
}

//Export the delete function so it can be used in the Route handler for an API request
exports.delete = async(req, res, next) => {
    try {
        //Extract student email from the API request body
        const { stu_Email } = req.body;

        //Await confirmation of successful student deletion
        const success = await StudentService.deleteStudent(stu_Email);

        if (success) {
            res.json({status: true, success: 'Student deleted successfully'});
            logger.studentLogger.log('info', 'Student deleted successfully');         
        } else {
            res.status(404).json({success: false, message: 'Specified student not found'});
        } 
    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.studentLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during student deletion'});
        next(error);
    }
}