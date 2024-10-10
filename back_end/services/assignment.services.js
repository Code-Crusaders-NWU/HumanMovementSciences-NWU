//Call Assignm_Model
const Assignment_Model = require('../models/assignments.model');
const LecturerService = require('../services/lecturer.services');
const validator = require('validator');

class AssignmentService {
    //Create assignment function
    static async createAssignment(assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description) {
        try {

            //Generate a unique 5-digit assignment number
            let assignmentExists = true;    
            while (assignmentExists) {
                assignm_Num = Math.floor(10000 + Math.random() * 90000); // Generate random 5-digit number

                // Check if the assignment number already exists
                const existingAssignment = await Assignment_Model.findOne({ assignm_Num });
                if (!existingAssignment) {
                    assignmentExists = false; // Exit loop if unique number is found
                }
            }   

            await this.validation(assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description);

            
            //Check if the assignment already exists within the database.
            const existingAssignment = await Assignment_Model.findOne({assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description});

            //If the assignment exists, the server throws an error
            if (existingAssignment) {
                throw new Error('An assignment with this number already exists');
            }

            //If no assignment with the specified number exists, the function can proceed
            const newAssignment = new Assignment_Model({assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description});

            //Store the new assignment in the database and return the saved object
            return await newAssignment.save();
        } catch (error) {
            throw error;
        }
    }


    //Delete assignment function
    static async deleteAssignment(assignm_Num) {
        try {
            //Check if the assignment to be deleted exists within the database
            const existingAssignment = await Assignment_Model.findOne({ assignm_Num });
            
            //If the assignment doesn't exist, throw an error
            if (!existingAssignment) {
                throw new Error('Specified assignment not found');
            }

            //Delete the assignment from the database
            await Assignment_Model.deleteOne({ assignm_Num });
            return {message: 'Assignment deleted successfully'};

        } catch (error) {
            throw error;
        }
    }


    //viewAllAssignments function that allows a lecturer to view all the assignments they have created
    static async viewAllAssignments(lec_Email) {
        try {
            //Find all assignments where the lecturer's email matches the provided one
            const lecAssignments = await Assignment_Model.find({lec_Email});

            //If no assignments are found, throw an error
            if (!lecAssignments) {
                throw new Error('Specified lecturer has not created any assignments');
            }

            //Return the list of the lecturer's assignments
            return lecAssignments;
        } catch (error) {
            throw error;
        }
    }

    //Function that lets a student view all the assignments they still have to do
    static async getDueAssignments(stu_Email) {
        try {
            const currentDate = new Date();

            //Find assignments with a due date in the future or today
            const dueAssignments = await Assignment_Model.find({
                due_date: {$gte: currentDate},
                students: {$in: [stu_Email]}
            })

            //If no due assignments, throw an error
            if (!dueAssignments || dueAssignments.length === 0) {
                throw new Error('No due assignments found');
            }

            return dueAssignments
        } catch (error) {
            throw error;
        }
    }

    //Function that lets a student view all assignments due today
    static async getAssignmentsDueToday(stu_Email) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); //Set to start of day
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1); //Set to start of next day

            const assignmentsDueToday = await Assignment_Model.find({
                due_date: {
                    $gte: today,
                    $lt: tomorrow
                },
                students: {$in: [stu_Email]}
            });

            // If no assignments are found
            if (!assignmentsDueToday || assignmentsDueToday.length === 0) {
                throw new Error('No assignments due today found');
            }

            return assignmentsDueToday;
        } catch (error) {
            throw error;
        }
    }

    //Validation
    static async validation(assignm_Num, assignm_Date, lec_Email, grade, due_date, title, description){
        try {

            //Check that the assignment number is valid 
            if(assignm_Num < 1){
                throw new Error('Invalid assignment number');
            }

            // **Test due date and test assignment date**
            const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

            if (!dateFormat.test(due_date)) {
            throw new Error('Due date format is invalid. Use YYYY-MM-DDTHH:mm:ssZ.');
            }


            if (!dateFormat.test(assignm_Date)) {
            throw new Error('Due date format is invalid. Use YYYY-MM-DDTHH:mm:ssZ.');
            }

            //Check if the assignment date is valid
            const checkDate = new Date(assignm_Date);
            if (!(checkDate instanceof Date) || isNaN(checkDate)) {
                throw new Error('Date is not in the correct format');
            }

            //Check if the due date is valid
            const checkDueDate = new Date(due_date);
            if (!(checkDueDate instanceof Date) || isNaN(checkDueDate)) {
                throw new Error('Due date is not in the correct format');
            }

            //assignm_Date is the date the assignment was created. This ensures that the due date is after the creation date.
            // = sign added for incase an assignment is only a small task to be completed in class for participation
            if(due_date <= assignm_Date){
                throw new Error("Due date needs to be later than assignment creation date");
            }

            //Date variables needed for validation
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            //Had to create this variable because the .getFullYear does not work without the variable being a date object.
            const tempDueDate = new Date(due_date);
            
            if (tempDueDate.getFullYear() !== currentYear) {
                throw new Error('Due date has to be in the current year');
            }
            
            //Same error as due date.
            const tempAssignDate = new Date(due_date);

            //Ensures the creation date is in the current year
            if (tempAssignDate.getFullYear() !== currentYear) {
                throw new Error('Due date has to be in the current year');
            }

            //Use validation from the validator NodeJS library to check if lec email is in the correct format.   
            if(!validator.isEmail(lec_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate lec email length
            if (lec_Email.length < 5 || lec_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }

            //Check that the grade is valid 
            if(grade < 0 || grade > 100 ){
                throw new Error('Invalid grade');
            }

            //Check if title is between a character limit
            if (!title || title.length < 3 || title.length > 50) {
                throw new Error('Assignment title must be between 3 and 50 characters long.')
            }

            //Check if description is within a character limit
            if (!description || description.length > 250) {
                throw new Error('Assignment description cannot be more than 250 characters.')
            }

        } catch (error) {
            throw error;
        }
       
    }


}

//Export the AssignmentService class, so that the rest of the codebase can access it
module.exports = AssignmentService;