const Video_Model = require('../models/videos.model');

class VideoService {
    static async createVideo(vid_Num, stu_Num, vid_Link, upload_Date, assignm_Num) {
        try {
            //Check if the video already exists within the database
            const existingVideo = await Video_Model.findOne({vid_Num, stu_Num, vid_Link, upload_Date, assignm_Num});

            //If the video exists, the server throws an error
            if (existingVideo) {
                throw new Error('A video with this number already exists');
            }

            //If no video with the specified number exists, the function can continue
            const newVideo = new Video_Model({vid_Num, stu_Num, vid_Link, upload_Date, assignm_Num});

            //Store the new video in the database and return the saved object
            return await newVideo.save();
        } catch (error) {
            throw error;
        }
    }
}

//Export the VideoService class, so that the rest of the codebase can access it
module.exports = VideoService;