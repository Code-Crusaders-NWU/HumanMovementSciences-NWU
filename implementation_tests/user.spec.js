const request = require('supertest');
const app = require('../back_end/app');
const UserModel = require('../back_end/models/user.model');
const jwt = require('jsonwebtoken');
const UserService = require('../back_end/services/user.services');
const dotenv = require('dotenv').config();

//Mock the User model
jest.mock('../back_end/models/user.model');
jest.mock('jsonwebtoken');

//Mock validation token
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = {user_type: 'admin'};
    next();
});

describe('User API Implementation Tests', () => {

    //User signup tests
    describe('POST /api/signup', () => {

        it('should register a new user and return 201', async () => {
            
            //Mock UserModel to simulate a new user creation
            UserModel.findOne.mockResolvedValue(null); //No user found
            UserModel.prototype.save = jest.fn().mockResolvedValue({
                email: 'user@example.com',
                password: 'examplePassword',
                user_type: 'student'
            });

            const res = await request(app)
            .post('/api/signup')
            .send({
                email: 'user@example.com',
                password: 'examplePassword',
                user_type: 'student'
            });

            //Assertions
            expect(res.status).toBe(201);
            expect(res.body.success).toBe('User has successfully signed up');

        });

        it('should return 500 if user already exists', async () => {

            UserModel.findOne.mockResolvedValue({email: 'user@example.com'});

            const res = await request(app)
            .post('/api/signup')
            .send({
                email: 'user@example.com',
                password: 'examplePassword',
                user_type: 'student'
            });

            //Assertions
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('An error occurred during registration');
        });

    });

    
    //User login tests
    describe('POST /api/login', () => {

        it('should log in the user successfully and return a token', async () => {

            //Mock a user in the database
            UserModel.findOne.mockResolvedValue({
                email: 'user@example.com',
                passwordcheck: jest.fn().mockResolvedValue(true),
                _id: 'userId20',
                user_type: 'student'
            });

            //Mock JWT token creation
            jwt.sign.mockReturnValue('exampleToken');

            const res = await request(app)
            .post('/api/login')
            .send({
                email: 'user@example.com',
                password: 'examplePassword',
            });

            //Assertions
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');

        });

        it('should return 500 if login fails', async () => {

            UserModel.findOne.mockResolvedValue(null); //No user found

            const res = await request(app)
            .post('/api/login')
            .send({
                email: 'user@example.com',
                password: 'examplePassword'
            });

            //Assertions
            expect(res.status).toBe(500);
            expect(res.body.token).toBeUndefined();

        });

    });


    //User delete tests
    describe('DELETE /api/user', () => {

        beforeEach(() => {
            jest.spyOn(UserService, 'deleteUser');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should delete an existing user and return 200', async () => {

            // Mock admin token creation
            const reqBody = {email: 'user@example.com'};

            //Mock deleteUser to return a success
            UserService.deleteUser.mockResolvedValue({message: 'User deleted successfully'});

            const res = await request(app)
                .delete('/api/user')
                .send({ email: 'user@example.com' });

            //Assertions
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User deleted successfully');         

        });

        it('should return 404 if user is not found', async () => {
            
            const res = await request(app)
            .delete('/api/user')
            .send({email: 'user@example.com'});

            //Assertions
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Specified user not found');
        });

    });

}); //Class describe