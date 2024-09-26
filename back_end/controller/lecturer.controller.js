//Call LecturerService
const LecturerService = require('../services/lecturer.services');
const logger = require('../config/logger');

//Export the lecturerCreate function so it can be used in the Route handler for API requests.
exports.lecturerCreate = async(req, res, next) => {
    try {
        //Extracts the lecturer information from the body of n API request
        const{lec_Email, lec_Name, lec_Surname, title, degree} = req.body;

        //Await confirmation of succesful lecturer creation
        const success = await LecturerService.createLecturer(lec_Email, lec_Name, lec_Surname, title, degree);
        logger.lecturerLogger.log('info', 'Lecturer information uploaded successfully');
        res.json({status: true, success: 'Lecturer information uploaded successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.lecturerLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during the lecturer information upload process', error: error.message});
        next(error);
    }
}

//Export the delete function so it can be used in the Route handler for an API request
exports.delete = async(req, res, next) => {
    try {
        //Extract lecturer email from the API request body
        const { lec_Email } = req.body;

        //Await confirmation of successful lecturer deletion
        const success = await LecturerService.deleteLecturer(lec_Email);

        
            res.json({status: true, success: success.message});            
            logger.lecturerLogger.log('info', 'Lecturer deleted successfully');
        
    } catch (error) {
        if (error.message === 'Specified lecturer not found') {
            return res.status(404).json({success: false, message: 'Specified lecturer not found'});
        }

        //Respond with server error (Status code: 500)
        logger.lecturerLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during lecturer deletion'});
        next(error);
    }
}