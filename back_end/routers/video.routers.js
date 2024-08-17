const router = require('express').Router();
const VideoController = require('../controller/video.controller');

//When the assign API is called
router.post('/video', VideoController.videoUpload);

//router.post

//Export the router so it is accessible by the main application
module.exports = router;