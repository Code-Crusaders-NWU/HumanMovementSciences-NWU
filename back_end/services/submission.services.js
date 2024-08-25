//Call submission model
const Submission_Model = require('../models/submission.model');

class SubmissionService {
    //Create submission function
    static async createSubmission(assignm_Num, stu_Email, submission_Date, content, grade, feedback) {
        try {
            //Check if the submission already exists within the database.
            const existingSubmission = await Submission_Model.findOne({assignm_Num, stu_Email, submission_Date, content, grade, feedback});

            //If the submission exists, the server throws an error
            if (existingSubmission) {
                throw new Error('This submission already exists');
            }

            //If no similar submission exists, the function can proceed
            const newSubmission = new Submission_Model({assignm_Num, stu_Email, submission_Date, content, grade, feedback});

            //Store the new submission in the database and return the saved object
            return await newSubmission.save();
        } catch (error) {
            throw error;
        }
    }


    //viewAllSubmissions function that allows a student to view all the submission they have made
    static async viewAllSubmissions(stu_Email) {
        try {
            //Find all submissions where the student's email matches the provided one
            const stuSubmissions = await Submission_Model.find({stu_Email});
    
            //If no submissions are found, throw an error
            if (!stuSubmissions) {
                throw new Error('Specified student has not made any submissions');
            }
    
            //Return the list of the student's submissions
            return stuSubmissions;
        } catch (error) {
            throw error;
        }
    }
}

//Export the SubmissionService class, so that the rest of the codebase can access it
module.exports = SubmissionService;