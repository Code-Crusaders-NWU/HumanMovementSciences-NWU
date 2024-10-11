const mongoose = require('mongoose');
const db = require ('../config/database');

const {Schema} = mongoose;

//Student Schema
const student_schema = new Schema({
    stu_Email : {
        type : String,
        unique : true,
        required : true,
        index: true
    },

    stu_Name : {
        type : String,
    },

    stu_Surname : {
        type : String,
    },
});

//Create mongoose model from the student schema
const Student_Model = mongoose.model('student', student_schema);

//Export student model so that the rest of the codebase can access it
module.exports = Student_Model;