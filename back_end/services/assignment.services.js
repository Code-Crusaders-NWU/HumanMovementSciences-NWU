//Call Assignm_Model
const Assignment_Model = require('../models/assignments.model');

class AssignmentService {
    //Create assignment function
    static async createAssignment(assignm_Num, assignm_Date, assignm_Feedback, stu_Email, lec_Email, grade, due_date) {
        try {

            this.validation(assignm_Num, assignm_Date, stu_Email, lec_Email, grade, due_date);

            
            //Check if the assignment already exists within the database.
            const existingAssignment = await Assignment_Model.findOne({assignm_Num, assignm_Date, assignm_Feedback, stu_Email, lec_Email, grade, due_date});

            //If the assignment exists, the server throws an error
            if (existingAssignment) {
                throw new Error('An assignment with this number already exists');
            }

            //If no assignment with the specified number exists, the function can proceed
            const newAssignment = new Assignment_Model({assignm_Num, assignm_Date, assignm_Feedback, stu_Email, lec_Email, grade, due_date});

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

    static validation(assignm_Num, assignm_Date, stu_Email, lec_Email, grade, due_date){
        try {

            //Check that the assignment number is valid 
            if(assignm_Num < 1){
                throw new Error('Invalid assignment number');
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

            //Checks to ensure the due date is either current date or in the future
            if (due_date < currentDate) {
                throw new Error('Due date must be the current date or a future date');
            }

            //Ensures the due date is in the current year
            if (due_date.getFullYear() !== currentYear) {
                throw new Error('Due date has to be in the current year');
            }

            //Ensures the creation date is in the current year
            if (assignm_Date.getFullYear() !== currentYear) {
                throw new Error('Due date has to be in the current year');
            }


            //Use validation from the validator NodeJS library to check if stu email is in the correct format.   
            if(!validator.isEmail(stu_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate stu email length
            if (stu_Email.length < 5 || stu_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
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

        } catch (error) {
            throw error;
        }
       
    }


}

//Export the AssignmentService class, so that the rest of the codebase can access it
module.exports = AssignmentService;