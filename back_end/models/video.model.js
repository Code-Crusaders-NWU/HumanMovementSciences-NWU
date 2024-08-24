const mongoose = require('mongoose');
const db = require('../config/database');

const {Schema} = mongoose;

//Video schema
const video_schema = new Schema({
    vid_Num : {
        type : Number,
        unique : true,
    },

    stu_Email : {
        type : Number
    },

    vid_Link : {
        type : String
    },

    upload_Date : {
        type : Date
    },

    assignm_Num : {
        type : Number
    },
});

//Create mongoose model from the video schema
const video_model = mongoose.model('video', video_schema);

//Export video model so that the rest of the codebase can access it
module.exports = video_model;