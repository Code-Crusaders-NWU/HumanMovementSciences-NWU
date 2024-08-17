const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const {Schema} = mongoose;

//Assignment schema
const assignment_schema = new Schema({
    assignm_Num : {
        type : Number,
        unique : true,
    },

    assignm_Date : {
        type : Date,
    },

    assignm_Feedback : {
        type : String,
    },

    stu_Num : {
        type : Number,
    },

    lec_Num : {
        type : Numberm,
    },

    grade : {
        type : Number,
    },

    due_date : {
        type : Date,
    },
});

//Create mongoose model from the assignment schema
const assignment_model = mongoose.model('Assignment', assignment_schema);

//Export user model so that the rest of the codebase can access it
module.exports = assignment_model;