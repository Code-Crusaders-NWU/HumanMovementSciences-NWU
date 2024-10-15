const User_Model = require('../models/user.model');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt')

class UserService {
    
    // This is a static method, meaning it can be called directly on the class without creating an instance of it.
    static async signUp(email, password, user_type, name, surname, title, degree) {
        try {

            //Call validation function
            this.validation(email, password, user_type);
            
            // See if the user already exists within the database.
            const existingUser = await User_Model.findOne({ email });

            // If the user exists the server should return an error
            if (existingUser) {
                throw new Error('This email address is already a member');
            }

            // If no user exists with this email the function can proceed to create a new user
            const newUser = new User_Model({ email, password, user_type, name, surname, title, degree});
            
            // Save the new user to the database and return the saved user objects
            return await newUser.save();
        } catch (error) {
            // If an error occurs in the try block, it will be caught here, and the error will be thrown
            throw error;
        }
    }

    //Delete user function
    static async deleteUser(email) {
        try {
            //Check if the user to be deleted exists within the database
            const existingUser = await User_Model.findOne({email});

            //If the user doesn't exist, throw an error
            if (!existingUser) {
                throw new Error('Specified user not found');
            }

            //Delete the user from the database
            await User_Model.deleteOne({ email });
            return {message: 'User deleted successfully'};
        } catch (error) {
            throw error;
        }
    }

    static async verifyUser(email) {
        try {
            const user = await User_Model.findOne({ email });
            return user;
        } //Exception handling if database operation goes wrong
        catch (err) {
            throw err; 
        }
    }

    static async createToken(payload, secretKey, jwt_expire) {
        return jwt.sign(payload, secretKey, { expiresIn: jwt_expire });
    }

    //Function to get a list of users with their roles
    static async getAllUsers() {
        try {
            const users = await User_Model.find({}, 'email user_type name surname title degree');

            //If no users found, throw an error
            if(!users || users.length === 0) {
                throw new Error('No users found');
            }

            //Return the list of users with their roles
            return users;
        } catch (error) {
            throw error;
        }
    }

    //Function to search for users
    static async searchUser(email) {
        try {
            const regex = new RegExp(email, 'i');

            //Find users based on the email being searched
            const users = await User_Model.find({email: {$regex: regex}});

            //If no users found, throw an error
            if(!users || users.length === 0) {
                throw new Error('No users found');
            }

            //Return search user details
            return users.map(user => ({
                email: user.email,
                user_type: user.user_type,
                name: user.name,
                surname: user.surname,
                title: user.title,
                degree: user.degree,
            }));
        } catch (error) {
            throw error;
        }
    }
    
    //Reset user password function
    static async resetPassword(email, newPassword) {
        try {
            //Find the user by their email
            const user = await User_Model.findOne({ email });

            //If the user doesn't exist, throw an error
            if (!user) {
                throw new Error('User not found');
            }

            //Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            //Update the user's password in the database
            user.password = hashedPassword;
            await user.save();

            return { message: 'Password reset successfully' };
        } catch (error) {
            throw error;
        }
    }

    //Validation
    static validation(email, password, user_type){
        try {
            //Use validation from the validator NodeJS library to check if email is in the correct format.   
            if(!validator.isEmail(email)){
                throw new Error('Invalid email adress');
            }

            // Validate email length
            if (email.length < 5 || email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }

            // Validate password length
            if (password.length < 8 || password.length > 30) {
                throw new Error('Password must be between 8 and 30 characters long');
            }

            if (user_type !== "student" && user_type !== "lecturer" && user_type !== "admin") {
                throw new Error("The provided user type is not valid.");
            } 
        } catch (error) {
            throw error;
        }
    }
}

// Export the UserService class so it can be used in other parts of the application
module.exports = UserService;
