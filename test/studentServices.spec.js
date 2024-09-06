const StudentService = require('../back_end/services/student.services');
const StudentModel = require('../back_end/models/student.model'); //Mock the model of student
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

describe('SubmissionService', () => {

    //Tests for createStudent
    describe('createStudent', () => {

        it('should create a new student if the student does not already exist', async () => {
            // Mock save function to mock save a new student
            const mockSave = jest.fn().mockResolvedValue({
                stu_Email: 'student@example.com',
                stu_Name: 'John',
                stu_Surname: 'Doe'
            });
    
            const mockStudentModel = jest.spyOn(StudentModel.prototype, 'save').mockImplementation(mockSave);
    
            // Mock validation and verifyStudent functions
            const mockValidation = jest.spyOn(StudentService.prototype, 'validation').mockImplementation(() => {});
            const mockVerifyStudent = jest.spyOn(StudentService.prototype, 'verifyStudent').mockResolvedValue(false); 
    
            const result = await StudentService.createStudent('student@example.com', 'John', 'Doe');
    
            // Assertions
            expect(mockValidation).toHaveBeenCalledWith('student@example.com', 'John', 'Doe');
            expect(mockVerifyStudent).toHaveBeenCalledWith('student@example.com');
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({
                stu_Email: 'student@example.com',
                stu_Name: 'John',
                stu_Surname: 'Doe'
            });
        });
    
        it('should throw an error if the student already exists', async () => {
            // Mock verifyStudent to return true
            const mockVerifyStudent = jest.spyOn(StudentService.prototype, 'verifyStudent').mockResolvedValue(true);

            await expect(StudentService.createStudent('student@example.com', 'John', 'Doe')).rejects.toThrow('A student with these credentials already exists');
    
            expect(mockVerifyStudent).toHaveBeenCalledWith('student@example.com');
        });
    
        it('should throw a validation error if the inputs are invalid', async () => {
            // Mock validation to throw an error
            const mockValidation = jest.spyOn(StudentService.prototype, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });
    
            await expect(StudentService.createStudent('invalid-email', 'John', 'Doe')).rejects.toThrow('Validation failed');
    
            expect(mockValidation).toHaveBeenCalledWith('invalid-email', 'John', 'Doe');
        });
    });


    describe('deleteStudent', () => {

        it('should delete the student if the student exists', async () => {
            // Mock findOne to return an existing student
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockResolvedValue({
                stu_Email: 'student@example.com',
                stu_Name: 'John',
                stu_Surname: 'Doe'
            });

            // Mock deleteOne to mock delete a student
            const mockDeleteOne = jest.spyOn(StudentModel, 'deleteOne').mockResolvedValue({ deletedCount: 1 });

            const result = await StudentService.deleteStudent('student@example.com');

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
            expect(mockDeleteOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
            expect(result).toEqual({ message: 'Student deleted successfully' });
        });

        it('should throw an error if the student does not exist', async () => {
            // Mock findOne to return null 
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockResolvedValue(null);

            // Call the function and expect an error
            await expect(StudentService.deleteStudent('student@example.com')).rejects.toThrow('Specified student not found');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });

        it('should handle errors and throw them properly', async () => {
            // Mock findOne for an error
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            // Call the function and expect error
            await expect(StudentService.deleteStudent('student@example.com')).rejects.toThrow('Database error');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });
    });

    describe('verifyStudent', () => {

        it('should return true if the student exists', async () => {
            // Mock findOne to return an student
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockResolvedValue({
                stu_Email: 'student@example.com',
                stu_Name: 'John',
                stu_Surname: 'Doe'
            });

            const result = await StudentService.verifyStudent('student@example.com');

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
            expect(result).toBe(true);
        });

        it('should return false if the student does not exist', async () => {
            // Mock findOne to return null 
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockResolvedValue(null);

            const result = await StudentService.verifyStudent('student@example.com');

            // Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
            expect(result).toBe(false);
        });

        it('should handle errors and throw them properly', async () => {
            // Mock findOne for an error
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            // Call the function and expect error
            await expect(StudentService.verifyStudent('student@example.com')).rejects.toThrow('Database error');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });
    });
});
