const Video_Model = require('../models/video.model');
const validator = require('validator');

class VideoService {
    static async createVideo(vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num) {
        try {

            //Generate a unique 7-digit video number
            let videoExists = true;    
            while (videoExists) {
                vid_Num = Math.floor(1000000 + Math.random() * 9000000);

                //Check if the video number already exists
                const existingVideo = await Video_Model.findOne({vid_Num});
                if (!existingVideo) {
                    videoExists = false; //Exit loop if unique number is found
                }
            }

            //Check if the video already exists within the database
            const existingVideo = await Video_Model.findOne({vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num});

            //If the video exists, the server throws an error
            if (existingVideo) {
                throw new Error('A video with this number already exists');
            }

            this.validation(vid_Num, stu_Email, upload_Date, assignm_Num);

            //If no video with the specified number exists, the function can continue
            const newVideo = new Video_Model({vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num});

            //Store the new video in the database and return the saved object
            return await newVideo.save();
        } catch (error) {
            throw error;
        }
    }

    //Delete video function
    static async deleteVideo(vid_Num) {
        try {
            //Check if the video to be deleted exists
            const existingVideo = await Video_Model.findOne({ vid_Num });

            //If the video doesn't exist, throw an error
            if (!existingVideo) {
                throw new Error('Specified video not found');
            }

            //Delete the video from the database
            await Video_Model.deleteOne({ vid_Num });
            return {message: 'Video deleted successfully'};

        } catch (error) {
            throw error;
        }
    }


    //Get video by vidNum
    static async getVideoByVidNum(vid_Num) {
        try {
            const video = await Video_Model.findOne({vid_Num});

            if (!video) {
                throw new Error(`No video found with video number: ${vid_Num}`);
            }
            return video;
        } catch (error) {
            throw error;
        }
    }


    static validation(vid_Num, stu_Email, upload_Date, assignm_Num){
        try {

            //Check that the vid number is valid 
            if(vid_Num < 1){
                throw new Error('Invalid video number');
            }

            //Check that the assignm_Num number is valid 
            if(assignm_Num < 1){
                throw new Error('Invalid assignment number');
            }

            //Check if the upload date is valid
            const checkDate = new Date(upload_Date);
            if (!(checkDate instanceof Date) || isNaN(checkDate)) {
                throw new Error('Upload Date is not in the correct format');
            }


            //Date variables needed for validation
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();


            //Create an object of date from upload_date, the getFullYear does not work if the variable is not a date object
            const tempUploadDate = new Date(upload_Date);
             
            //Ensures the upload date is in the current year
            if (tempUploadDate.getFullYear() !== currentYear) {
                throw new Error('Due date has to be in the current year');
            }


            //Use validation from the validator NodeJS library to check if stu email is in the correct format.   
            if(!validator.isEmail(stu_Email)){
                throw new Error('Invalid email adress');
            }

            // Validate stu email length
            if (stu_Email.length < 5 || stu_Email.length > 50) {
                throw new Error('Email should only be between 5 and 50 characters. ');
            }


        } catch (error) {
            throw error;
        }
       
    }


}

//Export the VideoService class, so that the rest of the codebase can access it
module.exports = VideoService;