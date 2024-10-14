//Call VideoService
const VideoService = require('../services/video.services');
const logger = require('../config/logger');



//Export the video function so it can be used in the Route handler for an API request
exports.videoUpload = async(req, res, next) => {
    try {
        //Extracts video information from the API request body
        const{vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num} = req.body;

        //Await confimation of successful video upload
        const success = await VideoService.createVideo(vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num);
        res.json({status: "true", success: 'Video uploaded successfully'});
        logger.videoLogger.log('info', 'Video uploaded successfully');
    } catch (error) {
        //Respond with server error (Status code: 500)
        logger.videoLogger.log('error', error.message);
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
            logger.videoLogger.log('info', 'Video deleted successfully');           
        } 

    } catch (error) {
        if (error.message === 'Specified video not found') {
            return res.status(404).json({ success: false, message: 'Specified video not found' });
        }

        //Respond with server error (Status code: 500) for all other errors
        logger.videoLogger.log('error', error.message);
        res.status(500).json({success: false, message: 'An error has occurred during video deletion', error: error.message});
        next(error);
    }
}

exports.getVideoByVidNum = async (req, res, next) => {
    try {
        const { vid_Num } = req.params;
        const video = await VideoService.getVideoByVidNum(vid_Num);

        if (!video) {
            return res.status(404).json({
                status: false,
                message: 'Video not found'
            });
        }

        res.status(200).json({ status: true, video });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'An error occurred while retrieving the video'
        });
        next(error);
    }
}