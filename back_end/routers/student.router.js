const router = require('express').Router();
const StudentController = require('../controller/student.controller');

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Add the students information
 *     description: This allows the creation of student which will be called together with user creation.
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stu_Email:
 *                 type: string
 *                 format: email
 *                 description: The student's email adress, must be unique.
 *                 example: "student@example.com"
 *               stu_Name:
 *                 type: string
 *                 description: first name.
 *                 example: "John"
 *               stu_Surname:
 *                 type: string
 *                 description: last name.
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Student information uploaded successfully
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
 *                   example: "Student information uploaded successfully"
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
 *                   example: "Invalid data or student record already exists"
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
 *                   example: "An error has occurred during the student information upload process"
 *                 error:
 *                   type: string
 *                   example: "Error from system will show here"
 */

router.post('/student', StudentController.studentCreate);

/**
 * @swagger
 * /student:
 *   delete:
 *     summary: DELETE student from database
 *     description: Deletes a student by using their email. 
 *     tags:
 *       - Student
 *     requestBody:
 *       description: Student deletion request with the student's email.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stu_Email:
 *                 type: string
 *                 description: The email of the student to be deleted.
 *                 example: "student@example.com"
 *     responses:
 *       '200':
 *         description: Successfull deletion of student 
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
 *                   example: "Student deleted successfully"
 *       '404':
 *         description: Student not found
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
 *                   example: "Specified student not found"
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
 *                   example: "An error has occurred during student deletion"
 */

//When the delete API is called
router.delete('/student', StudentController.delete);

//Export the router so it is accessible by the main application
module.exports = router;