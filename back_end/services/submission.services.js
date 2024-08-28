//Call submission model
const Submission_Model = require('../models/submission.model');
const validator = require('validator');


class SubmissionService {
    //Create submission function
    static async createSubmission(assignm_Num, stu_Email, submission_Date, content, grade, feedback) {
        try {

            this.validation(assignm_Num, stu_Email, submission_Date, content, grade, feedback);


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

    static validation(assignm_Num, stu_Email, submission_Date, content, grade, feedback){
        try {

           
            //Check that the assignm_Num number is valid 
            if(assignm_Num < 1){
                throw new Error('Invalid assignment number');
            }

            //Check if the submission date is valid
            const checkDate = new Date(submission_Date);
            if (!(checkDate instanceof Date) || isNaN(checkDate)) {
                throw new Error('Submission Date is not in the correct format');
            }


            //Date variables needed for validation
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();


            //Create an object of date from submission_date, the getFullYear does not work if the variable is not a date object
            const tempUploadDate = new Date(submission_Date);
             
            //Ensures the submission date is in the current year
            if (tempUploadDate.getFullYear() !== currentYear) {
                throw new Error('Has to be submitted in the current year');
            }

            //Checks to ensure the submission date is current date or in the future
            if (tempUploadDate < currentDate) {
                throw new Error('Submission date must be the current date');
            }


            //Use validation from the validator NodeJS library to check if stu email is in the correct format.   
            if(!validator.isEmail(stu_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate stu email length
            if (stu_Email.length < 5 || stu_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }

            //Check that the grade is valid 
            if(grade < 0 || grade > 100 ){
                throw new Error('Invalid grade');
            }

            //content


            //feedback


        } catch (error) {
            throw error;
        }
       
    }
}

//Export the SubmissionService class, so that the rest of the codebase can access it
module.exports = SubmissionService;