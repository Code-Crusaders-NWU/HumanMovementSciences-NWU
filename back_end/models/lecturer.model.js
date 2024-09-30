const mongoose = require('mongoose');
const db = require ('../config/database');

const {Schema} = mongoose;

//Lecturer Schema
const lecturer_schema = new Schema({
    lec_Email : {
        type : String,
        unique : true,
        required : true,
    },

    lec_Name : {
        type : String,
    },

    lec_Surname : {
        type : String,
    },

    title : {
        type : String,
    },

    degree : {
        type : String,
    }
});

//Create mongoose model from the lecturer schema
const Lecturer_Model = mongoose.model('lecturer', lecturer_schema);

//Export lecturer model so that the rest of the codebase can access it
module.exports = Lecturer_Model;