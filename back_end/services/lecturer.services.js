const Lecturer_Model = require('../models/lecturer.model');
const validator = require('validator');

class LecturerService {
    
    //Create lecturer function
    static async createLecturer(lec_Email, lec_Name, lec_Surname, title, degree) {
        try {

            //Call validation function
            this.validation(lec_Email, lec_Name, lec_Surname, title, degree);

            //Check if the lecturer already exists within the database
            const status = await this.verifyLecturer(lec_Email); //True or false

            //If the lecturer exists, the server throws an error
            if (status) {
                throw new Error('A lecturer with these credentials already exists');
            }

            //If no lecturer with the specified credentials exist, the function can continue
            const newLecturer = new Lecturer_Model({lec_Email, lec_Name, lec_Surname, title, degree});

            //Store the new lecturer in the database and return the saved object
            return await newLecturer.save();
        } catch (error) {
            throw error;
        }
    }

    //Delete lecturer function
    static async deleteLecturer(lec_Email) {
        try {
            //Check if the lecturer to be deleted exisits within the database
            const existingLecturer = await Lecturer_Model.findOne({lec_Email});

            //If the lecturer doesn't exist, throw an error
            if (!existingLecturer) {
                throw new Error('Specified lecturer not found');
            }

            //Delete the lecturer from the database
            await Lecturer_Model.deleteOne({lec_Email});
            return {message: 'Lecturer deleted successfully'};
        } catch (error) {
            throw error;
        }
    }

    //method to confirm lecturer exists, might use in other modules.
    static async verifyLecturer(lec_Email){
        try {
            const existingLecturer = await Lecturer_Model.findOne({lec_Email});
            console.log(!!existingLecturer);
            return !!existingLecturer; //Return true or false
        } catch (error) {
            throw error;
        }
    }

    //Validation
    static validation(lec_Email, lec_Name, lec_Surname, title, degree){
        try {
            //Use validation from the validator NodeJS library to check if email is in the correct format.   
            if(!validator.isEmail(lec_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate lec_Email length
            if (lec_Email.length < 5 || lec_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }

            // Validate lec_Name length
            if (lec_Name.length < 1 || lec_Name.length > 50) {
                throw new Error('Name should only be between 1 and 50 characters. ');
            }

            // Validate lec_Name characters
            if (!/^[a-zA-Z\s\-]+$/.test(lec_Name)) {
                throw new Error('Name should only contain alphabetic characters, hyphens, and spaces. ');
            }

            // Validate lec_surname length
            if (lec_Surname.length < 1 || lec_Surname.length > 50) {
                throw new Error('Surname should only be between 1 and 50 characters. ');
            }

            // Validate lec_surname characters
            if (!/^[a-zA-Z\s\-]+$/.test(lec_Surname)) {
                throw new Error('Surname should only contain alphabetic characters, hyphens, and spaces. ');
            }


            //validate title of lecturer
            if (title !== "B.Sc." && title !== "Hons" && title !== "M" && title !== "Dr.") {
                throw new Error("The provided lecturer title is not valid.");
            }

            //validate degree of lecturer
            if (degree !== "Bachelors" && degree !== "Honours" && degree !== "Masters" && degree !== "Doctors") {
                throw new Error("The provided lecturer degree is not valid.");
            }

        } catch (error) {
            throw error;
        }
       
    }
}

//Export the LecturerService class, so that the rest of the codebase can access it
module.exports = LecturerService;