const request = require('supertest');
const express = require('express');
const LecturerRouter = require('../back_end/routers/lecturer.router');
const LecturerService = require('../back_end/services/lecturer.services');
const { isLecturer } = require('../back_end/middleware/accessControl');

// Mock LecturerService
jest.mock('../back_end/services/lecturer.services');

//Mock authentication
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = { user_type: 'lecturer' }; 
    next();
});

jest.mock('../back_end/middleware/accessControl', () => ({
    isAdmin: (req, res, next) => {
        req.user = { user_type: 'admin' };
        next();
    },
}));

const app = express();
app.use(express.json());
app.use('/api', LecturerRouter);

describe('Lecturer API Implementation Tests', () => {

    //Create Lecturer tests
    describe('POST /api/lecturer', () => {

        it('should successfully create a lecturer and return 200', async () => {
            const reqBody = {
                lec_Email: 'lecturer@example.com',
                lec_Name: 'Pieter',
                lec_Surname: 'Roux',
                title: 'Dr.',
                degree: 'PhD'
            };

            // Mock createLecturer to succeed
            LecturerService.createLecturer.mockResolvedValue({
                lec_Email: reqBody.lec_Email,
                lec_Name: reqBody.lec_Name,
                lec_Surname: reqBody.lec_Surname,
                title: reqBody.title,
                degree: reqBody.degree
            });

            const response = await request(app)
                .post('/api/lecturer')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Lecturer information uploaded successfully');
        });

        it('should return 500 if lecturer creation fails', async () => {
            const reqBody = {
                lec_Email: 'lecturer@example.com',
                lec_Name: 'Pieter',
                lec_Surname: 'Roux',
                title: 'Prof.',
                degree: 'Masters'
            };

            // Mock createLecturer to throw an error
            LecturerService.createLecturer.mockRejectedValue(new Error('Failed to create lecturer'));

            const response = await request(app)
                .post('/api/lecturer')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during the lecturer information upload process');
            expect(response.body.error).toBe('Failed to create lecturer');
        });
    });

    //Delete Lecturer tests
    describe('DELETE /api/lecturer', () => {
        
        it('should successfully delete a lecturer and return 200', async () => {
            const reqBody = { lec_Email: 'lecturer@example.com' };

            // Mock deleteLecturer to succeed
            LecturerService.deleteLecturer.mockResolvedValue({ message: 'Lecturer deleted successfully' });

            const response = await request(app)
                .delete('/api/lecturer')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Lecturer deleted successfully');
        });

        it('should return 404 if lecturer is not found', async () => {
            const reqBody = { lec_Email: 'lecturer@example.com' };

            // Mock deleteLecturer to throw an error
            LecturerService.deleteLecturer.mockRejectedValue(new Error('Specified lecturer not found'));

            const response = await request(app)
                .delete('/api/lecturer')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Specified lecturer not found');
        });

        it('should return 500 if deletion fails', async () => {
            const reqBody = { lec_Email: 'lecturer@example.com' };

            // Mock deleteLecturer to throw an error
            LecturerService.deleteLecturer.mockRejectedValue(new Error('Failed to delete lecturer'));

            const response = await request(app)
                .delete('/api/lecturer')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during lecturer deletion');
        });
    });
});