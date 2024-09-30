const request = require('supertest');
const express = require('express');
const AssignmentRouter = require('../back_end/routers/assignment.routers'); 
const AssignmentService = require('../back_end/services/assignment.services');

// Mock AssignmentService
jest.mock('../back_end/services/assignment.services');

//Mock authentication
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = { user_type: 'lecturer' }; 
    next();
});

jest.mock('../back_end/middleware/accessControl', () => ({
    isLecturer: (req, res, next) => {
        req.user = { user_type: 'lecturer' };
        next();
    }, //Comment
}));

const app = express();
app.use(express.json());
app.use('/api', AssignmentRouter);

describe('Assignment API Implementation Tests', () => {

    // Create Assignment tests
    describe('POST /api/assignment', () => {

        it('should successfully create an assignment and return 200', async () => {
            const reqBody = {
                assignm_Num: 3,
                assignm_Date: '2024-09-08T14:30:00.000Z',
                lec_Email: 'lecturer@example.com',
                grade: 0,
                due_date: '2024-09-10T14:30:00.000Z'
            };

            // Mock createAssignment to succeed
            AssignmentService.createAssignment.mockResolvedValue({
                assignm_Num: reqBody.assignm_Num,
                assignm_Date: reqBody.assignm_Date,
                lec_Email: reqBody.lec_Email,
                grade: reqBody.grade,
                due_date: reqBody.due_date
            });

            const response = await request(app)
                .post('/api/assignment')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Assignment uploaded successfully');
        });

        it('should return 500 if assignment creation fails', async () => {
            const reqBody = {
                assignm_Num: 3,
                assignm_Date: '2024-09-08T14:30:00.000Z',
                lec_Email: 'lecturer@example.com',
                grade: 0,
                due_date: '2024-09-10T14:30:00.000Z'
            };

            // Mock createAssignment to throw an error
            AssignmentService.createAssignment.mockRejectedValue(new Error('Failed to create assignment'));

            const response = await request(app)
                .post('/api/assignment')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during assignment upload');
            expect(response.body.error).toBe('Failed to create assignment');
        });
    });

    // Delete Assignment tests
    describe('DELETE /api/assignment', () => {

        it('should successfully delete an assignment and return 200', async () => {
            const reqBody = { assignm_Num: 3 };

            // Mock deleteAssignment to succeed
            AssignmentService.deleteAssignment.mockResolvedValue({ message: 'Assignment deleted successfully' });

            const response = await request(app)
                .delete('/api/assignment')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Assignment deleted successfully');
        });

        it('should return 404 if assignment is not found', async () => {
            const reqBody = {assignm_Num: 3};

            // Mock deleteAssignment to throw an error
            AssignmentService.deleteAssignment.mockRejectedValue(new Error('Specified assignment not found'));

            const response = await request(app)
                .delete('/api/assignment')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Specified assignment not found');
        });

        it('should return 500 if deletion fails', async () => {
            const reqBody = {assignm_Num: 3};

            // Mock deleteAssignment to throw an error
            AssignmentService.deleteAssignment.mockRejectedValue(new Error('Failed to delete assignment'));

            const response = await request(app)
                .delete('/api/assignment')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during assignment deletion');
            expect(response.body.error).toBe('Failed to delete assignment');
        });
    });

    // View All Assignments tests
    describe('GET /api/assignment', () => {

        it('should return a list of assignments for the lecturer and return 200', async () => {
            const reqQuery = {lec_Email: 'lecturer@example.com'};

            // Mock viewAllAssignments to return assignments
            AssignmentService.viewAllAssignments.mockResolvedValue([
                { assignm_Num: 3, assignm_Date: '2024-09-08T14:30:00.000Z', grade: 85, due_date: '2024-09-10T14:30:00.000Z' }
            ]);

            const response = await request(app)
                .get('/api/assignment')
                .query(reqQuery);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.assignments).toHaveLength(1);
            expect(response.body.assignments[0].assignm_Num).toBe(3);
        });

        it('should return 500 if viewing assignments fails', async () => {
            const reqQuery = { lec_Email: 'lecturer@example.com' };

            // Mock viewAllAssignments to throw an error
            AssignmentService.viewAllAssignments.mockRejectedValue(new Error('Failed to retrieve assignments'));

            const response = await request(app)
                .get('/api/assignment')
                .query(reqQuery);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during assignment retrieval');
        });
    });
});