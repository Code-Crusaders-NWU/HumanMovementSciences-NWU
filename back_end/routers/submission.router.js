const router = require('express').Router();
const SubmissionController = require('../controller/submission.controller');
const authenticateToken = require('../middleware/auth'); 
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /submission:
 *   post:
 *     summary: Assignment submissions
 *     description: Allows for the submission of an assignment to be completed by a student, the relevant details must also be passed along.
 *     tags:
 *       - Submissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignm_Num:
 *                 type: integer
 *                 description: The unique number of the assignment being submitted.
 *                 example: 101
 *               stu_Email:
 *                 type: string
 *                 description: The email address of the student who is posting the submission, must be a registered student.
 *                 example: "student@example.com"
 *               submission_Date:
 *                 type: string
 *                 format: date-time
 *                 description: The date/time of submission in ISO format.
 *                 example: "2024-09-08T14:30:00.000Z"
 *               content:
 *                 type: string
 *                 description: The content of the student's submission.
 *                 example: "Assignment Content."
 *               grade:
 *                 type: number
 *                 description: The grade received for the submission (optional, usually added by the lecturer after grading each submission).
 *                 example: 85
 *               feedback:
 *                 type: string
 *                 description: Feedback provided by the lecturer (optional, lecturer has the option of adding feedback after grading the function).
 *                 example: "Good work!"
 *     responses:
 *       '200':
 *         description: Submission successful
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
 *                   example: "Submitted successfully"
 *       '500':
 *         description: Server error occurred during submission
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
 *                   example: "An error has occurred during the submission process"
 */


//When the submit API is called
router.post('/submission', authenticateToken, accessControl.isStudent ,SubmissionController.submit);

/**
 * @swagger
 * /submission:
 *   get:
 *     summary: View student submisions
 *     description: Retrieve all submissions made by a student using their email address.
 *     tags:
 *       - Submissions
 *     parameters:
 *       - in: body
 *         name: stu_Email
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             stu_Email:
 *               type: string
 *               description: Email adress of specific student who's submissions will be retreived.
 *               example: "student@example.com"
 *     responses:
 *       '200':
 *         description: Successfully retrieved all submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assignm_Num:
 *                         type: integer
 *                         example: 101
 *                       submission_Date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-08T14:30:00.000Z"
 *                       content:
 *                         type: string
 *                         example: "Content of assignment."
 *                       grade:
 *                         type: number
 *                         example: 85
 *                       feedback:
 *                         type: string
 *                         example: "Great!"
 *       '500':
 *         description: Server error occurred while retrieving submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error"
 */


//When the viewAll API is called
router.get('/submission',authenticateToken, accessControl.isLecturer ,SubmissionController.viewAll);

/**
 * @swagger
 * /submission/download_marks:
 *   get:
 *     summary: Download all students marks as a CSV file
 *     description: Provides a CSV file which can be downloaded to show the marks.
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: Successful download of marks CSV
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Server error occurred during file download
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dowloading error"
 *                 error:
 *                   type: string
 *                   example: "Error message from backend"
 */


//Route for downloading marks
router.get('/submission/download_marks', authenticateToken, accessControl.isLecturer,SubmissionController.downloadMarks);

/**
 * @swagger
 * /download_marks/{assignmentNumber}:
 *   get:
 *     summary: Download Assignment Marks (CSV File)
 *     description: Provides a CSV file for all the marks for students of a specific assignment number.
 *     tags:
 *       - Submissions
 *     parameters:
 *       - in: path
 *         name: assignmentNumber
 *         required: true
 *         schema:
 *           type: integer
 *           description: The assignment number for which all marks will be downloaded.
 *           example: 101
 *     responses:
 *       '200':
 *         description: Successful download of marks in CSV format
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Server error occurred during file download
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error during download"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message generated from NodeJS backend"
 */

//Route for downloading assignment spesific marks
router.get('/download_marks/:assignmentNumber',authenticateToken, accessControl.isLecturer ,SubmissionController.downloadSpesificMarks);

/**
 * @swagger
 * /submission/grade_submission:
 *   patch:
 *     summary: Grade student submission
 *     description: Allows lecturers to grade a students submission.
 *     tags:
 *       - Submissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignm_Num:
 *                 type: integer
 *                 description: The spesific assignment number.
 *                 example: 101
 *               stu_Email:
 *                 type: string
 *                 description: Student email who is being graded.
 *                 example: "student@example.com"
 *               grade:
 *                 type: number
 *                 format: integer
 *                 description: The grade for a specific assignment.
 *                 example: 85
 *     responses:
 *       '200':
 *         description: Submission graded successfully
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
 *                   example: "Submission graded successfully"
 *       '500':
 *         description: Server error occurred during grading of assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "A system error occured"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message from Node backend"
 */


//When the grade_submission API is called
router.patch('/submission/grade_submission', authenticateToken, accessControl.isLecturer,SubmissionController.grade);

/**
 * @swagger
 * /submission/provide_feedback:
 *   patch:
 *     summary: Lecturer provide feedback on assignment 
 *     description: Endpoint allowing lecturers to provide feedback on astudent for their submission.
 *     tags:
 *       - Submissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignm_Num:
 *                 type: integer
 *                 description: The unique assignment number.
 *                 example: 101
 *               stu_Email:
 *                 type: string
 *                 description: Student email for the submission. 
 *                 example: "student@example.com"
 *               feedback:
 *                 type: string
 *                 description: Feedback from lecturer on the submission.
 *                 example: "Great job!"
 *     responses:
 *       '200':
 *         description: Submission feedback assigned successfully
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
 *                   example: "Submission feedback assigned successfully"
 *       '500':
 *         description: Server error occurred during feedback assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error has occurred during the assignment feedback process"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message from node backend"
 */

//When the provide_feedback API is called
router.patch('/submission/provide_feedback', authenticateToken, accessControl.isLecturer,SubmissionController.feedback);

//Export the router
module.exports = router;