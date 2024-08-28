const Lecturer_Model = require('../models/lecturer.model');

class LecturerService {
    
    //Create lecturer function
    static async createLecturer(lec_Email, lec_Name, lec_Surname, title, degree) {
        try {
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
}

//Export the LecturerService class, so that the rest of the codebase can access it
module.exports = LecturerService;