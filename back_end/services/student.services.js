const Student_Model = require('../models/student.model');
const validator = require('validator');

class StudentService {
    //Create student function
    static async createStudent(stu_Email, stu_Name, stu_Surname) {
        try {

            this.validation(stu_Email, stu_Name,stu_Surname);

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
            return !!existingStudent;
        } catch (error) {
            throw error;
        }
    }


    static validation(stu_Email, stu_Name,stu_Surname){
        try {
            //Use validation from the validator NodeJS library to check if email is in the correct format.   
            if(!validator.isEmail(stu_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate stu_email length
            if (stu_Email.length < 5 || stu_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }

            // Validate stu_name length
            if (stu_Name.length < 1 || stu_Name.length > 50) {
                throw new Error('Name should only be between 1 and 50 characters. ');
            }

            // Validate stu_name characters
            if (!/^[a-zA-Z\s\-]+$/.test(stu_Name)) {
                throw new Error('Name should only contain alphabetic characters, hyphens, and spaces. ');
            }

            // Validate surname length
            if (stu_Surname.length < 1 || stu_Surname.length > 50) {
                throw new Error('Surname should only be between 1 and 50 characters. ');
            }

            // Validate surname characters
            if (!/^[a-zA-Z\s\-]+$/.test(stu_Surname)) {
                throw new Error('Surname should only contain alphabetic characters, hyphens, and spaces. ');
            }

        } catch (error) {
            throw error;
        }
       
    }

}

//Export the StudentService class, so that the rest of the codebase can access it
module.exports = StudentService;