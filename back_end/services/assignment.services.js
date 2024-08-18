//Call Assignm_Model
const Assignment_Model = require('../models/assignments.model');

class AssignmentService {
    //Create assignment function
    static async createAssignment(assignm_Num, assignm_Date, assignm_Feedback, stu_Num, lec_Num, grade, due_date) {
        try {
            //Check if the assignment already exists within the database.
            const existingAssignment = await Assignment_Model.findOne({assignm_Num, assignm_Date, assignm_Feedback, stu_Num, lec_Num, grade, due_date});

            //If the assignment exists, the server throws an error
            if (existingAssignment) {
                throw new Error('An assignment with this number already exists');
            }

            //If no assignment with the specified number exists, the function can proceed
            const newAssignment = new Assignment_Model({assignm_Num, assignm_Date, assignm_Feedback, stu_Num, lec_Num, grade, due_date});

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
            await Assignment_Model.deleteOne({ assignm_Num });    //Edit?
            return {message: 'Assignment deleted successfully'};

        } catch (error) {
            throw error;
        }
    }
}

//Export the AssignmentService class, so that the rest of the codebase can access it
module.exports = AssignmentService;