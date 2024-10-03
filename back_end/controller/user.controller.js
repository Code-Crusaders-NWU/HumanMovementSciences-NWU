// Calls the user Service to use its services for the API.
const UserService = require("../services/user.services")
const logger = require('../config/logger')
const dotenv = require('dotenv')

//Export the user function so it can be used in the Route handler for API requests. 
exports.register = async(req, res, next)=>{
    try{
        //Extracts email and password from the body of an API request.
        const{email,password,user_type} = req.body;
        
        //Wait for a success confirmation if the user uploading was successful.
        const success = await UserService.signUp(email,password,user_type);
        res.status(201).json({status:"true",success: 'User has successfully signed up'});
        logger.userLogger.log('info', 'User added successfully');
    }catch(error){
        // Respond with status code 500 to indicate a server error in the event of an error
        logger.userLogger.log('error', error.message);
        res.status(500).json({ success: false, message: 'An error occurred during registration', error: error.message });
        next(error);
    }};

//Export the delete function so it can be used in the Route handler for an API request
exports.delete = async(req, res, next) => {
    try {
        //Extract user email from the API request body
        const { email } = req.body;
        
        //Await confirmation of successful user deletion
        const success = await UserService.deleteUser(email);

        //If successful
        logger.userLogger.log('info','User deleted successfully');
        res.json({status: true, message: 'User deleted successfully'});
        
    } catch (error) {
        // Check if the error is a 'user not found' error
        if (error.message === 'Specified user not found') {
            return res.status(404).json({ success: false, error: error.message });
        }

        //Respond with server error (Status code: 500) for all other errors
        logger.userLogger.log('error',error.message);
        res.status(500).json({success: false, message: 'An error has occurred during user deletion'});
        next(error);
    }
}

exports.login = async(req,res,next)=>{
    try {
        //Gets email and password yet again from API BODY
        const{email,password} = req.body;

        //This variable will return the user if they exist in the database
        const user =await UserService.verifyUser(email);

        //If the user variable is empty, in other words no user was found
        if(!user){
            logger.userLogger.log('info',`Login failed => ${email} is not in our system`);
            throw new Error(`${email} is not in our system, please sign-up`);
        }

        //Use the defined password check from user_model to see if passwords match
        const status = await user.passwordcheck(password);
        if (status===false)
        {
            logger.userLogger.log('info','Login failed => invalid password');
            throw new Error("Entered password is invalid");
        }

        //Create a login token
        let token_data = {
            _id:    user._id,
            email:  user.email,
            user_type : user.user_type
        }

        const token = await UserService.createToken(token_data, process.env.TOKEN_KEY,  '2h');

        res.status(200).json({
            status: true,
            token:token
        });

        logger.userLogger.log('info',`Login Successful => ${email}`)
    } 
    catch (error) {
        // Respond with status code 500 to indicate a server error in the event of an error
        logger.userLogger.log('error', error.message);
        res.status(500).json({ success: false, message: 'An error occurred during login', error: error.message });
        next(error);    
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        //Call the service to get all users
        const users = await UserService.getAllUsers();

        //Log and return the user list
        logger.userLogger.log('info', 'Fetched all users successfully');
        res.status(200).json({status: true, users})
    } catch (error) {
        logger.userLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'Failed to get users', error: error.message});
        next(error);
    }
}

exports.searchUser = async (req, res, next) => {
    try {
        const {email} = req.query;
        const users = await UserService.searchUser(email);
        res.status(200).json({status: true, users});
    } catch (error) {
        res.status(500).json({status: false, message: error.message});
        next(error);
    }
}
