const User_Model = require('../model/user.model');

class UserService {
    
    // This is a static method, meaning it can be called directly on the class without creating an instance of it.
    static async signUp(email, password) {
        try {
            // See if the user already exists within the database.
            const existingUser = await UserModel.findOne({ email });

            // If the user exists the server should return an error
            if (existingUser) {
                throw new Error('This email address is already a member');
            }

            // If no user exists with this email the function can proceed to create a new user
            const newUser = new UserModel({ email, password });
            
            // Save the new user to the database and return the saved user object
            return await newUser.save();
        } catch (error) {
            // If an error occurs in the try block, it will be caught here, and the error will be thrown
            throw error;
        }
    }
}

// Export the UserService class so it can be used in other parts of the application
module.exports = UserService;
