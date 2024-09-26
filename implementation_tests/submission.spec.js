const request = require('supertest');
const express = require('express');
const SubmissionRouter = require('../back_end/routers/submission.router');
const SubmissionService = require('../back_end/services/submission.services');

// Mock SubmissionService
jest.mock('../back_end/services/submission.services');

//Mock authentication
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = { user_type: 'lecturer' }; 
    next();
});

jest.mock('../back_end/middleware/accessControl', () => ({
    isStudent: (req, res, next) => {
        req.user = { user_type: 'student' };
        next();
    },
    isLecturer: (req, res, next) => {
        req.user = { user_type: 'lecturer' };
        next();
    }
}));

const app = express();
app.use(express.json());
app.use('/api', SubmissionRouter);

describe('Submission API Implementation Tests', () => {

    // Create Submission tests
    describe('POST /api/submission', () => {
        it('should successfully submit an assignment and return 200', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                submission_Date: '2024-09-08T14:30:00.000Z',
                content: 'Video',
                grade: 90,
                feedback: 'Great work!'
            };

            // Mock createSubmission to succeed
            SubmissionService.createSubmission.mockResolvedValue(reqBody);

            const response = await request(app)
                .post('/api/submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Submitted successfully');
        });

        it('should return 500 if submission fails', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                submission_Date: '2024-09-08T14:30:00.000Z',
                content: 'Video',
                grade: 90,
                feedback: 'Great work!'
            };

            // Mock createSubmission to throw an error
            SubmissionService.createSubmission.mockRejectedValue(new Error('Submission failed'));

            const response = await request(app)
                .post('/api/submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during the submission process');
        });
    });

    // View All Submissions tests
    describe('GET /api/submission', () => {
        
        it('should successfully return all submissions for a student', async () => {
            const reqBody = {
                stu_Email: 'student@example.com'
            };

            const mockSubmissions = [
                {
                    assignm_Num: 1,
                    submission_Date: '2024-09-08T14:30:00.000Z',
                    content: 'Video',
                    grade: 90,
                    feedback: 'Great work!'
                }
            ];

            // Mock viewAllSubmissions to succeed
            SubmissionService.viewAllSubmissions.mockResolvedValue(mockSubmissions);

            const response = await request(app)
                .get('/api/submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.submissions).toEqual(mockSubmissions);
        });

        it('should return 500 if submission retrieval fails', async () => {
            const reqBody = { stu_Email: 'student@example.com' };

            // Mock viewAllSubmissions to throw an error
            SubmissionService.viewAllSubmissions.mockRejectedValue(new Error('Retrieval failed'));

            const response = await request(app)
                .get('/api/submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during submission retrieval');
        });
    });

    // Grade Submission tests
    describe('PATCH /api/submission/grade_submission', () => {

        it('should successfully grade a submission and return 200', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                grade: 90
            };

            // Mock gradeSubmission to succeed
            SubmissionService.gradeSubmission.mockResolvedValue(85);

            const response = await request(app)
                .patch('/api/submission/grade_submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Submission graded successfully');
        });

        it('should return 500 if grading fails', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                grade: 90
            };

            // Mock gradeSubmission to throw an error
            SubmissionService.gradeSubmission.mockRejectedValue(new Error('Grading failed'));

            const response = await request(app)
                .patch('/api/submission/grade_submission')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during the grade assignment process');
        });
    });

    // Provide Feedback tests
    describe('PATCH /api/submission/provide_feedback', () => {

        it('should successfully provide feedback and return 200', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                feedback: 'Great work!'
            };

            // Mock assignFeedback to succeed
            SubmissionService.assignFeedback.mockResolvedValue('Great work!');

            const response = await request(app)
                .patch('/api/submission/provide_feedback')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Submission feedback assigned successfully');
        });

        it('should return 500 if feedback assignment fails', async () => {
            const reqBody = {
                assignm_Num: 1,
                stu_Email: 'student@example.com',
                feedback: 'Great work!'
            };

            // Mock assignFeedback to throw an error
            SubmissionService.assignFeedback.mockRejectedValue(new Error('Feedback assignment failed'));

            const response = await request(app)
                .patch('/api/submission/provide_feedback')
                .send(reqBody);

            // Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during the assignment feedback process');
        });
    });
});