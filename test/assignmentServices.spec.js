const AssignmentService = require('../back_end/services/assignment.services');
const AssignmentModel = require('../back_end/models/assignment.model'); //Mock the model of user
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.URI);
});

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Disconnect from database after all tests
afterAll(async () => {
    await mongoose.disconnect();
});

//Mock all methods of userModel
jest.mock('../back_end/models/user.model');

describe('AssignmentService', () => {  

    //createAssignments test
    describe('createAssignment', () => {  

        it('should create a new assignment when data is valid and the assignment does not exist', async () => {
            const mockSave = jest.fn().mockResolvedValue({
                assignm_Num: 'A001',
                assignm_Date: '2023-09-01',
                assignm_Feedback: 'Great work!',
                stu_Email: 'student@example.com',
                lec_Email: 'lecturer@example.com',
                grade: 90,
                due_date: '2023-09-10'
            });

            const mockAssignmentModel = jest.spyOn(AssignmentModel.prototype, 'save').mockImplementation(mockSave);

            // Mocking validation and findOne functions
            const mockValidation = jest.spyOn(AssignmentService.prototype, 'validation').mockImplementation(() => {});
            const mockFindOne = jest.spyOn(AssignmentModel, 'findOne').mockResolvedValue(null); // No existing assignment

            const result = await AssignmentService.createAssignment(
                'A001', '2023-09-01', 'Great work!', 'student@example.com', 'lecturer@example.com', 90, '2023-09-10'
            );

            //Assertions
            expect(mockValidation).toHaveBeenCalledWith('A001', '2023-09-01', 'student@example.com', 'lecturer@example.com', 90, '2023-09-10');
            expect(mockFindOne).toHaveBeenCalledWith({
                assignm_Num: 'A001', 
                assignm_Date: '2023-09-01', 
                assignm_Feedback: 'Great work!', 
                stu_Email: 'student@example.com', 
                lec_Email: 'lecturer@example.com', 
                grade: 90, 
                due_date: '2023-09-10'
            });
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({
                assignm_Num: 'A001',
                assignm_Date: '2023-09-01',
                assignm_Feedback: 'Great work!',
                stu_Email: 'student@example.com',
                lec_Email: 'lecturer@example.com',
                grade: 90,
                due_date: '2023-09-10'
            });
        });

        it('should throw an error if the assignment already exists', async () => {
            // Mock findOne for existing assignment
            const mockFindOne = jest.spyOn(AssignmentModel, 'findOne').mockResolvedValue({
                assignm_Num: 'A001',
                assignm_Date: '2023-09-01',
                assignm_Feedback: 'Great work!',
                stu_Email: 'student@example.com',
                lec_Email: 'lecturer@example.com',
                grade: 90,
                due_date: '2023-09-10'
            });

            // Call the function and expect error
            await expect(AssignmentService.createAssignment(
                'A001', '2023-09-01', 'Great work!', 'student@example.com', 'lecturer@example.com', 90, '2023-09-10'
            )).rejects.toThrow('An assignment with this number already exists');

            expect(mockFindOne).toHaveBeenCalledWith({
                assignm_Num: 'A001', 
                assignm_Date: '2023-09-01', 
                assignm_Feedback: 'Great work!', 
                stu_Email: 'student@example.com', 
                lec_Email: 'lecturer@example.com', 
                grade: 90, 
                due_date: '2023-09-10'
            });
        });

        it('should throw a validation error if inputs are invalid', async () => {
            // Mock validation to throw error
            const mockValidation = jest.spyOn(AssignmentService.prototype, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });

            await expect(AssignmentService.createAssignment(
                'invalid-Num', 'invalid-Date', 'Great work!', 'student@example.com', 'lecturer@example.com', 90, '2023-09-10'
            )).rejects.toThrow('Validation failed');

            expect(mockValidation).toHaveBeenCalledWith('invalid-Num', 'invalid-Date', 'student@example.com', 'lecturer@example.com', 90, '2023-09-10');
        });

    });

    //createAssignments test
    describe('deleteAssignment', () => {

        it('should delete the assignment if it exists', async () => {
            // Mock findOne for an existing assignment
            const mockFindOne = jest.spyOn(AssignmentModel, 'findOne').mockResolvedValue({
                assignm_Num: 'A001',
                assignm_Date: '2023-09-01',
                assignm_Feedback: 'Good work!',
                stu_Email: 'student@example.com',
                lec_Email: 'lecturer@example.com',
                grade: 85,
                due_date: '2023-09-10'
            });

            // Mock deleteOne to simulate deletion
            const mockDeleteOne = jest.spyOn(AssignmentModel, 'deleteOne').mockResolvedValue({ deletedCount: 1 });

            const result = await AssignmentService.deleteAssignment('A001');

            //Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ assignm_Num: 'A001' });
            expect(mockDeleteOne).toHaveBeenCalledWith({ assignm_Num: 'A001' });
            expect(result).toEqual({ message: 'Assignment deleted successfully' });
        });

        it('should throw an error if the assignment does not exist', async () => {
            // Mock findOne to return null = assignment not found
            const mockFindOne = jest.spyOn(AssignmentModel, 'findOne').mockResolvedValue(null);

            await expect(AssignmentService.deleteAssignment('A999')).rejects.toThrow('Specified assignment not found');

            expect(mockFindOne).toHaveBeenCalledWith({ assignm_Num: 'A999' });
        });

        it('should handle errors and throw them properly', async () => {
            // Mock findOne to throw an error
            const mockFindOne = jest.spyOn(AssignmentModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            await expect(AssignmentService.deleteAssignment('A001')).rejects.toThrow('Database error');

            expect(mockFindOne).toHaveBeenCalledWith({ assignm_Num: 'A001' });
        });

    });

    //viewAllAssignments test
    describe('viewAllAssignments', () => {
    
        it('should return all assignments for the given lecturer email', async () => {
            // Mock find to return assignments
            const mockFind = jest.spyOn(AssignmentModel, 'find').mockResolvedValue([
                {
                    assignm_Num: 'A001',
                    assignm_Date: '2023-09-01',
                    assignm_Feedback: 'Great work!',
                    stu_Email: 'student1@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 85,
                    due_date: '2023-09-10'
                },
                {
                    assignm_Num: 'A002',
                    assignm_Date: '2023-09-02',
                    assignm_Feedback: 'Needs improvement',
                    stu_Email: 'student2@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 70,
                    due_date: '2023-09-15'
                }
            ]);

            const result = await AssignmentService.viewAllAssignments('lecturer@example.com');
    
            //Assertions
            expect(mockFind).toHaveBeenCalledWith({ lec_Email: 'lecturer@example.com' });
            expect(result).toEqual([
                {
                    assignm_Num: 'A001',
                    assignm_Date: '2023-09-01',
                    assignm_Feedback: 'Great work!',
                    stu_Email: 'student1@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 85,
                    due_date: '2023-09-10'
                },
                {
                    assignm_Num: 'A002',
                    assignm_Date: '2023-09-02',
                    assignm_Feedback: 'Needs improvement',
                    stu_Email: 'student2@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 70,
                    due_date: '2023-09-15'
                }
            ]);
        });
    
        it('should throw an error if no assignments are found for the lecturer', async () => {
            // Mock find to return an empty array (no assignments found)
            const mockFind = jest.spyOn(AssignmentModel, 'find').mockResolvedValue([]);
    
            await expect(AssignmentService.viewAllAssignments('lecturer@example.com')).rejects.toThrow('Specified lecturer has not created any assignments');
    
            expect(mockFind).toHaveBeenCalledWith({ lec_Email: 'lecturer@example.com' });
        });
    
        it('should handle errors and throw them properly', async () => {
            // Mock find to throw an error
            const mockFind = jest.spyOn(AssignmentModel, 'find').mockImplementation(() => {
                throw new Error('Database error');
            });
    
            // Call the function and expect it to throw the database error
            await expect(AssignmentService.viewAllAssignments('lecturer@example.com')).rejects.toThrow('Database error');

            expect(mockFind).toHaveBeenCalledWith({ lec_Email: 'lecturer@example.com' });
        });
    });
});
