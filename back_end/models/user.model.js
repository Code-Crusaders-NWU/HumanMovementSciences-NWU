const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const {Schema} = mongoose;


//This is the user schema "blue-print" for properties the data must have to be accepted into the database.
const user_schema = new Schema({
    email : {
        type: String,
        lowercase: true,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    user_type : {               //Property of user to manage access control. D
        type : String,
        lowercase: true,    
        required : true
    }
});


//This is the user schema "blue-print" for properties the data must have to be accepted into the database.
user_schema.pre('save', async function(){
    try{
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hash_password =await bcrypt.hash(user.password,salt);

        //Stores user password as the hash_password
        user.password = hash_password;
    }
    catch(err){
        console.log('Error whilst hashing password: ' + err);
    }
})

/*This creates a method within the user schema which is used to compares the input_password from the API with the database passowrd, 
this is done using the built in compare method from the bcrypt library which we used to hash the password*/ 

user_schema.methods.passwordcheck = async function(input_password){
    try {
        const status = await bcrypt.compare(input_password,this.password);
        return status;  //True or False, if passwords match or not
    } catch (error) {
        throw error;
    }
} 


/*Mongoose model is created from user schema 
=> Mongoose Model is a tool from Mongoose library in Node to interact with the documents in a MongoDB collection.
*/
const user_model = mongoose.model('user',user_schema);

// Export the user model so other parts of the code base can interact with it.
module.exports = user_model;