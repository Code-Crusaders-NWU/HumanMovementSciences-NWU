const request = require('supertest');
const express = require('express');
const StudentRouter = require('../back_end/routers/student.router');
const StudentService = require('../back_end/services/student.services');

//Mock StudentService
jest.mock('../back_end/services/student.services');

//Mock authentication
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = { user_type: 'student' }; 
    next();
});

jest.mock('../back_end/middleware/accessControl', () => ({
    isStudent: (req, res, next) => {
        req.user = { user_type: 'student' };
        next();
    },
}));

const app = express();
app.use(express.json());
app.use('/api', StudentRouter);

describe('Student API Implementation Tests', () => {

    //Student create tests
    describe('POST /api/student', () => {

        it('should successfully create a student and return 200', async () => {

            const reqBody = {
                stu_Email: 'student@example.com',
                stu_Name: 'Pieter',
                stu_Surname: 'Roux'
            };

            // Mock createStudent to succeed
            StudentService.createStudent.mockResolvedValue({
                stu_Email: reqBody.stu_Email,
                stu_Name: reqBody.stu_Name,
                stu_Surname: reqBody.stu_Surname
            });

            const response = await request(app)
            .post('/api/student')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Student information uploaded successfully')

        });

        it('should return 500 if student creation fails', async () => {
            const reqBody = {
                stu_Email: 'student@example.com',
                stu_Name: 'Pieter',
                stu_Surname: 'Roux'
            };

            // Mock createStudent to throw an error
            StudentService.createStudent.mockRejectedValue(new Error('Failed to create student'));

            const response = await request(app)
                .post('/api/student')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during the student information upload process');
            expect(response.body.error).toBe('Failed to create student');
        });
    });

    //Delete student tests
    describe('DELETE /api/student', () => {
        it('should successfully delete a student and return 200', async () => {
            const reqBody = { stu_Email: 'student@example.com' };

            // Mock deleteStudent to succeed
            StudentService.deleteStudent.mockResolvedValue({message: 'Student deleted successfully'});

            const response = await request(app)
                .delete('/api/student')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Student deleted successfully');
        });

        it('should return 404 if student is not found', async () => {
            const reqBody = { stu_Email: 'student@example.com' };

            // Mock deleteStudent to throw an error
            StudentService.deleteStudent.mockRejectedValue(new Error('Specified student not found'));

            const response = await request(app)
                .delete('/api/student')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Specified student not found');
        });

        it('should return 500 if deletion fails', async () => {
            const reqBody = { stu_Email: 'student@example.com' };

            // Mock deleteStudent to throw an error
            StudentService.deleteStudent.mockRejectedValue(new Error('Failed to delete student'));

            const response = await request(app)
                .delete('/api/student')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during student deletion');
        });
    });

}); //Class describe