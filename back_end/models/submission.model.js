const mongoose = require('mongoose');
const db = require('../config/database');

const {Schema} = mongoose;

//Submission schema
const submission_schema = new Schema({
    assignm_Num : {
        type : Number,
        unique : true,
    },

    stu_Email : {
        type : String,
    },

    submission_Date : {
        type : Date,
    },

    content : {
        type : String,
    },

    grade : {
        type : Number,
    },

    feedback : {
        type : String,
    }
})

//Create mongoose model from the submission schema
const submission_model = mongoose.model('submission', submission_schema);

//Export the submission model so that the rest of the codebase can access it
module.exports = submission_model;