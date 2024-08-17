//Call VideoService
const VideoService = require('../services/video.services');

//Export the video function so it can be used in the Route handler for an API request
exports.videoUpload = async(req, res, next) => {
    try {
        //Extracts video information from the API request body
        const{vid_Num, stu_Num, vid_Link, upload_Date, assignm_Num} = req.body;

        //Await confimation of successful video upload
        const success = await VideoService.createVideo(vid_Num, stu_Num, vid_Link, upload_Date, assignm_Num);

        res.json({status: "true", success: 'Video uploaded successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during video upload', error: error.message });
        next(error);
    }
}