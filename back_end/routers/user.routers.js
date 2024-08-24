
const router = require('express').Router();
const UserController = require("../controller/user.controller")

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers new users with an email, password and user_type(admin, student, lecturer). There is various validation ensuring correct data is entered and there is no conflict by registering up an existing email.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - user_type
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email adress which will be used in the system as an identifier.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: A secure password between 8 and 30 characters, is also hashed once it is passed to the backend.
 *                 example: password123
 *               user_type:
 *                 type: string
 *                 enum: [student, lecturer, admin]
 *                 description: Role of the user which is primarily used for access control, the lecturers can only be created by an admin and regular users are automatically created as students.
 *                 example: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: true
 *                 success:
 *                   type: string
 *                   example: User has successfully signed up
 *       500:
 *         description: Internal Server Error - An error occurred during registration
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
 *                   example: An error occurred during registration
 */

//When the signup api is called the register function is called from the user.coltroller.js file
router.post('/signup',UserController.register);  

//When Login API is called
router.post('/login',UserController.login);

//When the Delete API is called
router.delete('/user', UserController.delete);

//Work in progress
//router.post('/login',UserController.register);
//Work in progress

module.exports = router; //Export router so it can be used by the main application file