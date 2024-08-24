// Calls the user Service to use its services for the API.
const UserService = require("../services/user.services")

//Export the user function so it can be used in the Route handler for API requests. 
exports.register = async(req, res, next)=>{
    try{
        //Extracts email and password from the body of an API request.
        const{email,password} = req.body;
        
        //wait for a success confirmation if the user uploading was successful.
        const success = await UserService.signUp(email,password);


        res.json({status: true, success: 'User has successfully signed up'});
    }catch(error){

        // Respond with status code 500 to indicate a server error in the event of an error
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

        if (success) {
            res.json({status: true, message: 'User deleted successfully'});
        } else {
            res.status(404).json({success: false, message: 'Specified user not found'});
        }
    } catch (error) {
        //Respond with server error (Status code: 500)
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
            throw new Error(`${email} is not in our system, please sign-up`);
        }

        //Use the defined password check from user_model to see if passwords match
        const status = await user.passwordcheck(password);
        if (status===false)
        {
            throw new Error("Entered password is invalid");
        }

        //Create a login token
        let token_data = {
            _id:user._id,
            email:user.email
        }

        const token = await UserService.createToken(token_data,"^6s3Wvm&dz8^su",'2h');

        res.status(200).json({
            status: true,
            token:token
        });

    } catch (error) {
        // Respond with status code 500 to indicate a server error in the event of an error
        res.status(500).json({ success: false, message: 'An error occurred during login', error: error.message });
        next(error);    
    }
};
