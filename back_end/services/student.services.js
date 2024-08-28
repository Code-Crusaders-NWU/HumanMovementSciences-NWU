const Student_Model = require('../models/student.model');

class StudentService {
    //Create student function
    static async createStudent(stu_Email, stu_Name, stu_Surname) {
        try {
            //Check if the student already exists within the database
            const status = await this.verifyStudent(stu_Email);

            //If the student exists, the server throws an error
            if (status) {
                throw new Error('A student with these credentials already exists');
            }

            //If no student with the specified credentials exist, the function can continue
            const newStudent = new Student_Model({stu_Email, stu_Name, stu_Surname});

            //Store the new student in the database and return the saved object
            return await newStudent.save();
        } catch (error) {
            throw error;
        }
    }

    //Delete student function
    static async deleteStudent(stu_Email) {
        try {
            //Check if the student to be deleted exisits within the database
            const existingStudent = await Student_Model.findOne({stu_Email});

            //If the student doesn't exist, throw an error
            if (!existingStudent) {
                throw new Error('Specified student not found');
            }

            //Delete the student from the database
            await Student_Model.deleteOne({stu_Email});
            return {message: 'Student deleted successfully'};
        } catch (error) {
            throw error;
        }
    }

    //Method to confirm the student exists
    static async verifyStudent(stu_Email) {
        try {
            const existingStudent = await Student_Model.findOne({stu_Email});
            console.log(!!existingStudent);
            return !!existingStudent;
        } catch (error) {
            throw error;
        }
    }
}

//Export the StudentService class, so that the rest of the codebase can access it
module.exports = StudentService;