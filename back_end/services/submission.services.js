//Call submission model
const Submission_Model = require('../models/submission.model');
const validator = require('validator');
const StudentService = require('../services/student.services');
const fs = require('fs');
const {format} = require('@fast-csv/format');


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

    
    //gradeSubmission function that allows a lecturer to grade a student's work
    static async gradeSubmission(assignm_Num, stu_Email, grade) {
        try {
            //Find the submission by assign_Num and stu_Email
            const submission = await Submission_Model.findOne({assignm_Num, stu_Email});

            //Check if the submission exists
            if (!submission) {
                throw new Error('Specified submission not found');
            }

            //Assign the grade to the submission
            submission.grade = grade;
            await submission.save();

            return grade;

        } catch (error) {
            throw new Error('Grade assignment failed');
        }
    }


    //assignFeedback function that allows a lecturer provide a student with feedback on their grade/work.
    static async assignFeedback(assignm_Num, stu_Email, feedback) {
        try {
            //Find the submission by assign_Num and stu_Email
            const submission = await Submission_Model.findOne({assignm_Num, stu_Email});
    
            //Check if the submission exists
            if (!submission) {
                throw new Error('Specified submission not found');
            }
    
            //Assign the feedback to the submission
            submission.feedback = feedback;
            await submission.save();
    
            return feedback;
    
        } catch (error) {
            throw new Error('Feedback assignment failed');
        }
    }


    //Function to count a specified student's submissions
    static async getSubmissionCount(stu_Email) {
        try {
            //Count the number of submissions of a student
            const submissionCount = await Submission_Model.countDocuments({stu_Email});
            
            //Return the count
            return submissionCount;
        } catch (error) {
            throw new Error('Database Error');
        }
    }


    //Function to get the submission not yet graded by a lecturer
    static async getUngradedSubmissions(lec_Email) {
        try {
            //Find all assignments by the lecturer
            const ungradedSubmissions = await Submission_Model.find({
                grade: null,  
                lec_Email: lec_Email
            });

            //If no ungraded submissions are found, throw an error
            if (ungradedSubmissions.length === 0) {
                throw new Error('No ungraded submissions found for this lecturer');
            }

            return ungradedSubmissions;
        } catch (error) {
            throw error;
        }
    }

    
    //Validation
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
            //if (tempUploadDate < currentDate) {
                //throw new Error('Submission date must be the current date');
            //}

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

    //Getting all marks in csv format
    static async getAllMarks(){

     try{
        //Get submissions
        const submissions = await Submission_Model.find();

        //Validation for if there is no submissions
        if(submissions.length === 0){
            throw new Error('No submissions available');
        }

        //Stream for csv data
        const Stream = format({headers: true});
        const writeStream = fs.createWriteStream("grading.csv");
        Stream.pipe(writeStream);

        //Add student emails and grade of all submissions to stream
        submissions.forEach(submission => {
            Stream.write({
                assignm_Num: submission.assignm_Num,
                stu_Email: submission.stu_Email,
                grade: submission.grade
            })
        })

        Stream.end();

        //Let the stream finish
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        //Return csv file path
        return 'grading.csv';

    } catch (error){
        throw error;
    }

   }


   //Getting assignment spesific marks in csv format
   static async getAssignmentMarks(assignmentNumber){

    try{
       //Get submissions for spesific assignments
       const submissions = await Submission_Model.find({assignm_Num: assignmentNumber});

       //Validation for if there is no submissions
       if(submissions.length === 0){
           throw new Error('No submissions available for that assignment');
       }

       //Stream for csv data
       const Stream = format({headers: true});
       const writeStream = fs.createWriteStream("grading.csv");
       Stream.pipe(writeStream);

       //Add student emails and grade of all submissions to stream
       submissions.forEach(submission => {
           Stream.write({
               assignm_Num: submission.assignm_Num,
               stu_Email: submission.stu_Email,
               grade: submission.grade,
               feedback: submission.feedback
           })
       })

       Stream.end();

       //Let the stream finish
       await new Promise((resolve, reject) => {
           writeStream.on('finish', resolve);
           writeStream.on('error', reject);
       });

       //Return csv file path
       return 'grading.csv';

   } catch (error){
       throw error;
   }

  }


  //Get submissions for a sepcific assignment
  static async getSubmissionsByAssignmNum(assign_Num) {
    try {
        const submissions = await Submission_Model.find({assignm_Num: assign_Num});

        if (!submissions || submissions.length === 0) {
            throw new Error('No submissions found for the specified assignment');
        }

        return submissions;
    } catch (error) {
        throw error;
    }
  }
 
}

//Export the SubmissionService class, so that the rest of the codebase can access it
module.exports = SubmissionService;