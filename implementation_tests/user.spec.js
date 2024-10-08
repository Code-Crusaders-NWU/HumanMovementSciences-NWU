const request = require('supertest');
const app = require('../back_end/app');
const UserModel = require('../back_end/models/user.model');
const jwt = require('jsonwebtoken');
const UserService = require('../back_end/services/user.services');
const dotenv = require('dotenv').config();

//Mock the User model
jest.mock('../back_end/models/user.model');
jest.mock('../back_end/services/user.services')
jest.mock('jsonwebtoken');

//Mock validation token
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = {user_type: 'admin'};
    next();
});

jest.mock('../back_end/middleware/accessControl', () => ({
    isAdmin: (req, res, next) => {
        req.user = { user_type: 'admin' };
        next();
    },
    isLecturer: (req, res, next) => {
        req.user = { user_type: 'lecturer' };
        next();
    },
    isStudent: (req, res, next) => {
        req.user = { user_type: 'student' };
        next();
    }
}));

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

            // Mock UserService.signUp to simulate user already existing
            UserService.signUp.mockRejectedValue(new Error('User already exists'));
        
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

            //Mock the user and password verification
            UserService.verifyUser = jest.fn().mockResolvedValue({
                email: 'user@example.com',
                passwordcheck: jest.fn().mockResolvedValue(true), //Mock password check to return true
                _id: 'userId20',
                user_type: 'student'
            });
        
            //Mock token creation
            UserService.createToken = jest.fn().mockResolvedValue('exampleToken');
        
            const res = await request(app)
            .post('/api/login')
            .send({
                email: 'user@example.com',
                password: 'examplePassword',
            });
        
            //Assertions
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');
            expect(res.body.token).toBe('exampleToken');
        });
        

        it('should return 500 if login fails', async () => {

            //Mock the service to return `null`, meaning no user found
            UserService.verifyUser = jest.fn().mockResolvedValue(null); //Simulate no user found
        
            const res = await request(app)
            .post('/api/login')
            .send({
                email: 'user@example.com',
                password: 'examplePassword'
            });
        
            //Assertions
            expect(res.status).toBe(500);
            expect(res.body.token).toBeUndefined();
            expect(res.body.message).toBe('An error occurred during login');
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
            //Mock deleteUser to simulate user not found
            UserService.deleteUser.mockRejectedValue(new Error('Specified user not found'));
        
            const res = await request(app)
                .delete('/api/user')
                .send({ email: 'user@example.com' });
        
            //Assertions
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Specified user not found');
        });
        

    });

    //getUsers Tests
    describe('GET /api/allUsers', () => {

        it('should return a list of users and status 200', async () => {
            const mockUsers = [
                { email: 'user1@example.com', user_type: 'admin' },
                { email: 'user2@example.com', user_type: 'student' }
            ];

            //Mock service
            UserService.getAllUsers.mockResolvedValue(mockUsers);

            const response = await request(app)
                .get('/api/allUsers')
                .set('Authorization', 'Bearer token');

            //Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.users).toEqual(mockUsers);
        });

        it('should return 404 if no users are found', async () => {
            UserService.getAllUsers.mockRejectedValue(new Error('No users found'));

            const response = await request(app)
                .get('/api/allUsers')
                .set('Authorization', 'Bearer token');

            //Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Failed to get users');
            expect(response.body.error).toBe('No users found');
        });

        it('should return 500 if there is a server error', async () => {
            UserService.getAllUsers.mockRejectedValue(new Error('Database Error'));

            const response = await request(app)
                .get('/api/allUsers')
                .set('Authorization', 'Bearer token');

            //Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Failed to get users');
            expect(response.body.error).toBe('Database Error');
        });

    });

}); //Class describe