const router = require('express').Router();
const AssignmentController = require('../controller/assignment.controller');
const authenticateToken = require('../middleware/auth'); 
const accessControl = require('../middleware/accessControl');

/**
 * @swagger
 * /api/assignment:
 *   post:
 *     summary: Upload an assignment
 *     description: This endpoint allows authorized users(e.g. admin, lecturer) to create a new assignment.
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignm_Num:
 *                 type: number
 *                 description: Random identifier for each assignment, must be unique.
 *                 example: 12345
 *               assignm_Date:
 *                 type: string
 *                 format: date-time
 *                 description: The date the assignment opens for the students.
 *                 example: "2024-09-08T14:30:00.000Z"
 *               lec_Email:
 *                 type: string
 *                 format: email
 *                 description: The lecturer's email address.
 *                 example: "lecturer@example.com"
 *               grade:
 *                 type: number
 *                 description: The mark allocation for the assignment.
 *                 example: 30
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: The date the assignment is due.
 *                 example: "2024-09-08T14:30:00.000Z"
 *               title:
 *                 type: string
 *                 description: The title of the assignment.
 *                 example: "Assignment 1: Practical Assignment"
 *               description:
 *                 type: string
 *                 description: A short description of the assignment.
 *                 example: "This practical assignment consists of 3 parts. Complete each one and submit."
 *      
 *     responses:
 *       200:
 *         description: Assignment uploaded successfully
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
 *                   example: "Assignment uploaded successfully"
 *       400:
 *         description: Bad request
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
 *                   example: "An assignment with this number already exists"
 *       500:
 *         description: Server error
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
 *                   example: "An error has occurred during assignment upload"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message here"
 */

//When the assign API is called
router.post('/assignment', authenticateToken , accessControl.isLecturer, AssignmentController.assign);

/**
 * @swagger
 * /api/assignment:
 *   delete:
 *     summary: Delete Assignment
 *     description: Delete an assignment by using unique assignment number as identifier.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Assignments
 *     requestBody:
 *       description: Assignment number provided to delete assignment.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignm_Num:
 *                 type: integer
 *                 description: The assignment number to be deleted.
 *                 example: 987654
 *     responses:
 *       '200':
 *         description: Assignment deleted successfully
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
 *                   example: "Assignment deleted successfully"
 *       '404':
 *         description: Assignment not found
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
 *                   example: "Specified assignment not found"
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
 *                   example: "An error has occurred during assignment deletion"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

//When the delete API is called
router.delete('/assignment', authenticateToken, accessControl.isLecturer ,AssignmentController.delete);

/**
 * @swagger
 * /api/assignment:
 *   get:
 *     summary: Show all lecturer assignments.
 *     description: Retrieve all assignments for a specific lecturer by using their email.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: query
 *         name: lec_Email
 *         required: true
 *         schema:
 *           type: string
 *           description: Lecturer's email to retreive their assignments.
 *           example: "lecturer@example.com"
 *     responses:
 *       '200':
 *         description: A list of all assignments, in JSON format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assignm_Num:
 *                         type: integer
 *                         example: 12345
 *                       title:
 *                         type: string
 *                         example: "Assignment Title"
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-08T14:30:00.000Z"
 *                       description:
 *                         type: string
 *                         example: "Description of individual assignment"
 *       '500':
 *         description: Internal server error
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
 *                   example: "An error has occurred during assignment retrieval"
 */

//When the viewAll API is called
router.get('/assignment', authenticateToken, accessControl.isLecturer ,AssignmentController.viewAll);

/**
 * @swagger
 * /api/dueAssignments:
 *   get:
 *     summary: Retreive assignments which is due after TODAY
 *     description: This endpoint allows students to view all assignments which is due after today. 
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved due assignments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assignmentId:
 *                         type: string
 *                         example: "12345"
 *                       title:
 *                         type: string
 *                         example: "Bio Kinetics H1"
 *                       dueDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-31"
 *                       description:
 *                         type: string
 *                         example: "Exercise 1 in textbook"
 *       500:
 *         description: Internal server error.
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
 *                   example: "An error has occurred while fetching due assignments."
 */


//When the dueAssignments API is called
router.get('/dueAssignments', authenticateToken, accessControl.isStudent, AssignmentController.dueAssignments);

/**
 * @swagger
 * /api/dueToday:
 *   get:
 *     summary: Get assignments for a student that is due today.
 *     description: Retrieves all assignments that are due today for a specific student.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: A list of assignments due today for the authenticated student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assignm_Num:
 *                         type: integer
 *                         example: 2
 *                       title:
 *                         type: string
 *                         example: "Video assignment 3"
 *                       description:
 *                         type: string
 *                         example: "Complete Video Assignment 3 and submit it in a ZIP file."
 *                       assignm_Date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-01T14:30:00.000Z"
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-03T23:59:59Z"
 *                       lec_Email:
 *                         type: string
 *                         format: email
 *                         example: "lecturer@example.com"
 *                       grade:
 *                         type: integer
 *                         example: 85
 *                       students:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "student@example.com"
 *       '404':
 *         description: No assignments due today.
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
 *                   example: "No assignments found that are due today."
 *       '500':
 *         description: Internal server error.
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
 *                   example: "An error occurred while fetching assignments due today"
 */

//When the dueToday API is called
router.get('/dueToday', authenticateToken, accessControl.isStudent, AssignmentController.dueToday);

//Export the router so it accessible by the main application
module.exports = router;