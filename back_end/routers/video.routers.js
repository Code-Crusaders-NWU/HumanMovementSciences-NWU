const router = require('express').Router();
const VideoController = require('../controller/video.controller');

//When the video upload API is called
router.post('/video', VideoController.videoUpload);

//When the delete API is called
router.delete('/video', VideoController.delete);

//router.post

//Export the router so it is accessible by the main application
module.exports = router;