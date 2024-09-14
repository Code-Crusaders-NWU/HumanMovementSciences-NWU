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
 *                 type: string
 *                 description: Identifier for each assignment, must be unique.
 *                 example: "123456"
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
 *                 description: The grade received for the assignment.
 *                 example: 85
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: The date the assignment is due.
 *                 example: "2024-09-08T14:30:00.000Z"
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

//Export the router so it accessible by the main application
module.exports = router;