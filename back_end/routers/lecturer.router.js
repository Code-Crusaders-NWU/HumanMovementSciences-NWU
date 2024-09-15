const router = require('express').Router();
const LecturerController = require('../controller/lecturer.controller');
const authenticateToken = require('../middleware/auth'); 
const accessControl = require('../middleware/accessControl');


/**
 * @swagger
 * /api/lecturer:
 *   post:
 *     summary: Create lecturer account
 *     description: Allows admin users to create a lecturers profile to give them lecturer privileges .
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Lecturers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lec_Email:
 *                 type: string
 *                 description: The lecturer's email address.
 *                 example: "lecturer@example.com"
 *               lec_Name:
 *                 type: string
 *                 description: lecturer's first name.
 *                 example: "John"
 *               lec_Surname:
 *                 type: string
 *                 description: lecturer's last name.
 *                 example: "Doe"
 *               title:
 *                 type: string
 *                 description: The lecturer's title (e.g., Dr., Prof.).
 *                 example: "Dr."
 *               degree:
 *                 type: string
 *                 description: The Lecturers most relevant and highest degree for example PhD.
 *                 example: "PhD in Computer Science"
 *     responses:
 *       '200':
 *         description: Lecturer information uploaded successfully
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
 *                   example: "Lecturer information uploaded successfully"
 *       '500':
 *         description: Server error occurred during lecturer information upload
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
 *                   example: "An error has occurred during the lecturer information upload process"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message from node backend"
 */


//When the lecturerCreate API is called
router.post('/lecturer', authenticateToken, accessControl.isAdmin ,LecturerController.lecturerCreate);

/**
 * @swagger
 * /api/lecturer:
 *   delete:
 *     summary: Delete a lecturer user
 *     description: Allows admin users to delete a lecturers profile.
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Lecturers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lec_Email:
 *                 type: string
 *                 description: Lecturer email who will be deleted.
 *                 example: "lecturer@example.com"
 *     responses:
 *       '200':
 *         description: Lecturer deleted successfully
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
 *                   example: "Lecturer deleted successfully"
 *       '404':
 *         description: Lecturer not found
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
 *                   example: "Specified lecturer not found"
 *       '500':
 *         description: Server error occurred during lecturer deletion
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
 *                   example: "An error has occurred during lecturer deletion"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message from node backend"
 */


//When the delete API is called
router.delete('/lecturer', authenticateToken, accessControl.isAdmin, LecturerController.delete);

//Export the router so it is accessible by the main application
module.exports = router;