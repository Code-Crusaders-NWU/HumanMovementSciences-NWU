//Call VideoService
const VideoService = require('../services/video.services');

//Export the video function so it can be used in the Route handler for an API request
exports.videoUpload = async(req, res, next) => {
    try {
        //Extracts video information from the API request body
        const{vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num} = req.body;

        //Await confimation of successful video upload
        const success = await VideoService.createVideo(vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num);

        res.json({status: "true", success: 'Video uploaded successfully'});
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during video upload', error: error.message });
        next(error);
    }
}

//Export the delete function so it can be used in the Route handler for an API request
exports.delete = async(req, res, next) => {
    try {
        //Extract video number from the API request body
        const { vid_Num } = req.body;

        //Await confirmation of successful video deletion
        const success = await VideoService.deleteVideo(vid_Num);

        if (success) {
            res.json({status: true, success: 'Video deleted successfully'});            
        } else {
            res.status(404).json({success: false, message: 'Specified video not found'});
        } 
    } catch (error) {
        //Respond with server error (Status code: 500)
        res.status(500).json({success: false, message: 'An error has occurred during video deletion'});
        next(error);
    }
}