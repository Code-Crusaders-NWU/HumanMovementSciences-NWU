// Calls the user Service to use its services for the API.
const UserService = require("../services/user.services")

//Export the user function so it can be used in the Route handler for API requests. 
exports.register = async(req, res, next)=>{
    try{
        //Extracts email and password from the body of an API request.
        const{email,password} = req.body;
        
        //wait for a success confirmation if the user uploading was successful.
        const success = await UserService.signUp(email,password);


        res.json({status:"true",success: 'User has successfully signed up'});
    }catch(error){

        // Respond with status code 500 to indicate a server error in the event of an error
        res.status(500).json({ success: false, message: 'An error occurred during registration', error: error.message });
        next(error);
    }
}