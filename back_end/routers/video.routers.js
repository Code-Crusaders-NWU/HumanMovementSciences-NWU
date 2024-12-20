const router = require('express').Router();
const VideoController = require('../controller/video.controller');
const authenticateToken = require('../middleware/auth'); 
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /api/video:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Videos
 *     summary: The MongoDB Video object referring to a video stored on AWS
 *     description: This endpoint uploads the RECORD of a video for student submission.
 *     requestBody:
 *       description: Information about the video uploaded to Mongo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stu_Email:
 *                 type: string
 *                 example: "student@example.com"
 *                 description: "student's email adress of the video being uploaded"
 *               vid_Link:
 *                 type: string
 *                 example: "https://videoserver.com/path/video.mp4"
 *                 description: "Link to the uploaded video"
 *               upload_Date:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-08T14:30:00.000Z"
 *                 description: "Date the video was uploaded"
 *               assignm_Num:
 *                 type: integer
 *                 example: "12345"
 *                 description: "Assignment number associated with the video"
 *     responses:
 *       '200':
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 success:
 *                   type: string
 *                   example: "Video uploaded successfully"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error has occurred during video upload"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message here"
 */

//When the video upload API is called
router.post('/video', authenticateToken, accessControl.isStudent,VideoController.videoUpload);

/**
 * @swagger
 * /api/video:
 *   delete:
 *     summary: Delete a user's video
 *     description: Delete a user video using the video number. 
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Videos
 *     requestBody:
 *       description: Deletion request consisting of video number for the video to be deleted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vid_Num:
 *                 type: integer
 *                 description: The video number to be deleted.
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 success:
 *                   type: string
 *                   example: "Video deleted successfully"
 *       '404':
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Specified video not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error during deletion"
 */


//When the delete API is called
router.delete('/video', authenticateToken, accessControl.isStudent ,VideoController.delete);

/**
 * @swagger
 * /api/video/{vid_Num}:
 *   get:
 *     summary: Retrieve video by vid_Num
 *     description: Get details of a video based on vid_Num.
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: vid_Num
 *         required: true
 *         description: Unique ID of the video to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A video object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vid_Num:
 *                   type: integer
 *                   description: "The unique identifier for the video"
 *                   example: 1234567
 *                 stu_Email:
 *                   type: string
 *                   description: "The email of the student who uploaded the video"
 *                   example: "student@example.com"
 *                 vid_Link:
 *                   type: string
 *                   description: "The URL link to the video"
 *                   example: "https://example.com/video1"
 *                 upload_Date:
 *                   type: string
 *                   format: date-time
 *                   description: "The date the video was uploaded"
 *                   example: "2024-10-11T12:34:56Z"
 *                 assignm_Num:
 *                   type: integer
 *                   description: "The assignment number associated with the video"
 *                   example: 12345
 *                 
 *                   
 *       403:
 *         description: Access denied. Only lecturers can perform this action.
 *       404:
 *         description: Video not found.
 */
router.get('/video/:vid_Num', authenticateToken, accessControl.isLecturer, VideoController.getVideoByVidNum);

//Export the router so it is accessible by the main application
module.exports = router;