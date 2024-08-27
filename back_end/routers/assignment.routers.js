const router = require('express').Router();
const AssignmentController = require('../controller/assignment.controller');

/**
 * @swagger
 * /assignment:
 *   post:
 *     summary: Upload an assignment
 *     description: This endpoint allows authorized users(e.g. admin, lecturer) to create a new assignment.
 *     tags:
 *       - Assignments
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
 *                 format: date
 *                 description: The date the assignment opens for the students.
 *                 example: "2024-08-24"
 *               assignm_Feedback:
 *                 type: string
 *                 description: Feedback from the lecturer or in rare occassions the admin, to the student.
 *                 example: "Well done!"
 *               stu_Email:
 *                 type: string
 *                 format: email
 *                 description: The student's email address.
 *                 example: "student@example.com"
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
 *                 format: date
 *                 description: The date the assignment is due.
 *                 example: "2024-08-31"
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
router.post('/assignment', AssignmentController.assign);

//When the delete API is called
router.delete('/assignment', AssignmentController.delete);

//When the viewAll API is called
router.get('/assignment', AssignmentController.viewAll);

//Export the router so it accessible by the main application
module.exports = router;