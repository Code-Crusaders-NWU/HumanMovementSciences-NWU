const SubmissionService = require('../back_end/services/submission.services');
const SubmissionModel = require('../back_end/models/submission.model'); //Mock the model of submissions
const dotenv = require('dotenv');
const fs = require('fs');
const { format } = require('@fast-csv/format');

dotenv.config();

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of SubmissionModel
jest.mock('../back_end/models/submission.model');

describe('SubmissionService', () => {

    //gradeSubmission Tests
    describe('gradeSubmission', () => {

        it('should grade a submission successfully', async () => {
            //Mock the findOne and save methods of SubmissionModel
            const mockSubmission = {
                save: jest.fn().mockResolvedValue(true),
                grade: undefined,
            };

            SubmissionModel.findOne.mockResolvedValue(mockSubmission);

            const assignm_Num = 1;
            const stu_Email = 'student@example.com';
            const grade = 85;

            const result = await SubmissionService.gradeSubmission(assignm_Num, stu_Email, grade);

            //Assertions
            expect(SubmissionModel.findOne).toHaveBeenCalledWith({assignm_Num, stu_Email });
            expect(mockSubmission.grade).toBe(grade);
            expect(mockSubmission.save).toHaveBeenCalledWith();
            expect(result).toBe(grade);
        });

        it('should throw an error if the submission is not found', async () => {
            SubmissionModel.findOne.mockResolvedValue(null);

            const assignm_Num = 1;
            const stu_Email = "student@example.com";
            const grade = 85;

            await expect(SubmissionService.gradeSubmission(assignm_Num, stu_Email, grade))
            .rejects
            .toThrow('Grade assignment failed');
        });
    });

    //createSubmission Tests
    describe('createSubmission', () => {

        it('should successfully create a new submission', async () => {
            
            const submissionData = {
                assignm_Num: '1',
                stu_Email: 'student@example.com',
                submission_Date: new Date(),
                content: 'Video',
                grade: null,
                feedback: null,
            };

            //Mocking the database methods
            SubmissionModel.findOne = jest.fn().mockResolvedValue(null); //No existing submission
            SubmissionModel.prototype.save = jest.fn().mockResolvedValue(submissionData); //Simulate save method
            
            const result = await SubmissionService.createSubmission(
                submissionData.assignm_Num,
                submissionData.stu_Email,
                submissionData.submission_Date,
                submissionData.content,
                null, //grade
                null //feedback
            );

            //Assertions
            expect(SubmissionModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                assignm_Num: '1',
                stu_Email: 'student@example.com',
            }));
            expect(result).toEqual(submissionData);
        }); 

        it('should throw an error if a submission already exists', async () => {
            
            const submissionData = {
                assignm_Num: '1',
                stu_Email: 'student@example.com',
                submission_Date: new Date(),
                content: 'Video',
            };

            //Mocking findOne to simulate an existing submission
            SubmissionModel.findOne = jest.fn().mockResolvedValue(submissionData);

            await expect(SubmissionService.createSubmission(
                submissionData.assignm_Num,
                submissionData.stu_Email,
                submissionData.submission_Date,
                submissionData.content,
                null, //grade
                null //feedback
            ))
            .rejects
            .toThrow('This submission already exists');
        });

        it('should throw a validation error if required fields are missing', async () => {
            
            SubmissionService.validation = jest.fn(() => {throw new Error('Validation failed'); });

            await expect(SubmissionService.createSubmission(
                '1',
                'student@example.com',
                new Date(),
                null, //content
                null, //grade
                null //feedback
            ))
            .rejects
            .toThrow('Validation failed');
        });
    });

    //viewAllSubmissions Tests
    describe('viewAllSubmissions', () => {

        it('should return all submissions for a given student email', async () => {
            const stu_Email = 'student@example.com';
            const mockSubmissions = [
                {assignm_Num: '1', stu_Email},
                {assignm_Num: '2', stu_Email},
            ];

            //Mocking the database method
            SubmissionModel.find = jest.fn().mockResolvedValue(mockSubmissions);

            const result = await SubmissionService.viewAllSubmissions(stu_Email);

            //Assertions
            expect(SubmissionModel.find).toHaveBeenCalledWith({stu_Email});
            expect(result).toEqual(mockSubmissions);
        });

        it('should throw an error if no submissions are found for a given student', async () => {
            const stu_Email = 'student@example.com';

            // Mocking find to simulate no submissions found
            SubmissionModel.find = jest.fn().mockResolvedValue(null);

            await expect(SubmissionService.viewAllSubmissions(stu_Email))
                .rejects
                .toThrow('Specified student has not made any submissions');
        });
    });

    //assignFeedback Tests
    describe('assignFeedback', () => {

        it('should assign feedback to a student/s submission successfully', async () => {
            const assignm_Num = '1';
            const stu_Email = 'student@example.com';
            const feedback = 'Good work!';
    
            //Mock a submission found in the database
            const mockSubmission = { 
                assignm_Num, 
                stu_Email, 
                feedback: '' 
            };
    
            //Mock the database functions
            SubmissionModel.findOne = jest.fn().mockResolvedValue(mockSubmission);
            mockSubmission.save = jest.fn().mockResolvedValue(mockSubmission);
    
            const result = await SubmissionService.assignFeedback(assignm_Num, stu_Email, feedback);
    
            // Assertions
            expect(SubmissionModel.findOne).toHaveBeenCalledWith({ assignm_Num, stu_Email });
            expect(mockSubmission.feedback).toBe(feedback);
            expect(mockSubmission.save).toHaveBeenCalled();
            expect(result).toBe(feedback);
        });

        it('should throw an error if the specified submission is not found', async () => {
            const assign_Num = '1';
            const stu_Email = 'student@example.com';
            const feedback = 'You can do better.';

            //Mock the findOne method to simulate no submission found
            SubmissionModel.findOne = jest.fn().mockResolvedValue(null);

            await expect(SubmissionService.assignFeedback(assign_Num, stu_Email, feedback))
            .rejects
            .toThrow('Feedback assignment failed');
        });

        it('should throw a general error if feedback assignment fails', async () => {
            const assignm_Num = '1';
            const stu_Email = 'student@example.com';
            const feedback = 'Good effort!';
    
            // Mock the findOne method to return a submission
            const mockSubmission = { assignm_Num, stu_Email, feedback: '' };
            SubmissionModel.findOne = jest.fn().mockResolvedValue(mockSubmission);
    
            // Mock the save method to simulate a failure
            mockSubmission.save = jest.fn().mockRejectedValue(new Error('Save failed'));
    
            await expect(SubmissionService.assignFeedback(assignm_Num, stu_Email, feedback))
                .rejects
                .toThrow('Feedback assignment failed');
        });
    });


    //getAssignmentMarks Test
    describe('getAssignmentMarks', () => {

        it('should throw an error if no submissions are found for the given assignment number', async () => {
            const assignmentNumber = '2';

            // Mock the find method to return an empty array
            SubmissionModel.find = jest.fn().mockResolvedValue([]);
    
            await expect(SubmissionService.getAssignmentMarks(assignmentNumber))
                .rejects
                .toThrow('No submissions available for that assignment');
        });
    });

    //getAllMarks Test
    describe('getAllMarks', () => {

        it('should throw an error if there are no submissions', async () => {
            SubmissionModel.find = jest.fn().mockResolvedValue([]);
    
            await expect(SubmissionService.getAllMarks())
            .rejects
            .toThrow('No submissions available');
        });
    }); 
});