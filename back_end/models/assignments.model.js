const mongoose = require('mongoose');
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

    lec_Email : {
        type : String,
    },

    grade : {
        type : Number,
    },
    
    due_date : {
        type : Date,
    },
    
});

//Create mongoose model from the assignment schema
const assignment_model = mongoose.model('assignment', assignment_schema);

//Export assignment model so that the rest of the codebase can access it
module.exports = assignment_model;