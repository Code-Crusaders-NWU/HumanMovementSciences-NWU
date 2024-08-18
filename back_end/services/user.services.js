const User_Model = require('../models/user.model');
const jwt = require('jsonwebtoken')

class UserService {
    
    // This is a static method, meaning it can be called directly on the class without creating an instance of it.
    static async signUp(email, password) {
        try {
            // See if the user already exists within the database.
            const existingUser = await User_Model.findOne({ email });

            // If the user exists the server should return an error
            if (existingUser) {
                throw new Error('This email address is already a member');
            }

            // If no user exists with this email the function can proceed to create a new user
            const newUser = new User_Model({ email, password });
            
            // Save the new user to the database and return the saved user object
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
        } //Exception handling if database operation goes south
        catch (err) {
            throw err; 
        }
    }

    static async createToken(token,secretKey,jwt_expire){
       return jwt.sign(token,secretKey,{expiresIn:jwt_expire});
    }
}




// Export the UserService class so it can be used in other parts of the application
module.exports = UserService;
