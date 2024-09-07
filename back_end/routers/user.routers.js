
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
 *                 description: User email, must be in an email format
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password, must be between 8 and 30 chars long.
 *                 example: password123
 *               user_type:
 *                 type: string
 *                 enum: [student, lecturer, admin]
 *                 description: Role of user which will be used for access control, Can only be admin, lecturer or student.
 *                 example: student
 *     responses:
 *       201:
 *         description: Successful User Registration
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login 
 *     description: Existing users can sign in using email and password. 
 *     tags: [User]
 *     requestBody:
 *       description: User details (e.g. email + password)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user, must be in a valid email format
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password (shoud be between 8-30 chars long, however the validation is already done in registration)
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Bad request (missing or invalid fields)
 *       '401':
 *         description: Unauthorized (invalid email or password)
 *       '500':
 *         description: Internal server error
 */

//When Login API is called
router.post('/login',UserController.login);

/**
 * @swagger
 * /user:
 *   delete:
 *     tags: [User]
 *     summary: Delete a using a user's email
 *     description: This Delete Endpoint removes a user's account from the system by using email.
 *     operationId: deleteUser
 *     requestBody:
 *       description: User email, must be a user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: "User's email"
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       '404':
 *         description: Specified user not found
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
 *                   example: "Specified user not found"
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
 *                   example: "An error has occurred during user deletion"
 */
//When the Delete API is called
router.delete('/user', UserController.delete);

//Work in progress
//router.post('/login',UserController.register);
//Work in progress

module.exports = router; //Export router so it can be used by the main application file