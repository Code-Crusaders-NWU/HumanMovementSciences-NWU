const StudentService = require('../back_end/services/student.services');
const StudentModel = require('../back_end/models/student.model'); //Mock the model of student
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of userModel
jest.mock('../back_end/models/user.model');

describe('SubmissionService', () => {

    //Tests for createStudent
    describe('createStudent', () => {

        it('should create a new student successfully', async () => {
            const stu_Email = 'student@example.com';
            const stu_Name = 'Pieter';
            const stu_Surname = 'Roux';

            //Mock validation function
            jest.spyOn(StudentService, 'validation').mockImplementation(() => {});

            //Mock the findOne method to return null (no existing student)
            jest.spyOn(StudentModel, 'findOne').mockResolvedValue(null);

            //Mock the save method for creating a new user
            const mockSave = jest.fn().mockResolvedValue({stu_Email, stu_Name, stu_Surname});
            StudentModel.prototype.save = mockSave;

            //Call createStudent method
            const result = await StudentService.createStudent(stu_Email, stu_Name, stu_Surname);

            //Assertions
            expect(StudentService.validation).toHaveBeenCalledWith(stu_Email, stu_Name, stu_Surname);
            expect(StudentModel.findOne).toHaveBeenCalledWith({stu_Email});
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({stu_Email, stu_Name, stu_Surname});
        });
    
        it('should throw an error if the student already exists', async () => {
            // Mock verifyStudent to return true
            const mockVerifyStudent = jest.spyOn(StudentService, 'verifyStudent').mockResolvedValue(true);

            await expect(StudentService.createStudent('student@example.com', 'John', 'Doe'))
            .rejects
            .toThrow('A student with these credentials already exists');
    
            expect(mockVerifyStudent).toHaveBeenCalledWith('student@example.com');
        });
    
        it('should throw a validation error if the inputs are invalid', async () => {
            // Mock validation to throw an error
            const mockValidation = jest.spyOn(StudentService, 'validation').mockImplementation(() => {
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
            await expect(StudentService.deleteStudent('student@example.com'))
            .rejects
            .toThrow('Specified student not found');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });

        it('should handle errors and throw them properly', async () => {
            // Mock findOne for an error
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            // Call the function and expect error
            await expect(StudentService.deleteStudent('student@example.com'))
            .rejects
            .toThrow('Database error');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });
    });

    /*

    describe('verifyStudent', () => {

        it('should return true if the student exists', async () => {
            // Mock findOne to return a student
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
            expect(mockFindOne).toHaveBeenCalledWith({stu_Email});
            expect(result).toBe(false);
        });

        it('should handle errors and throw them properly', async () => {
            // Mock findOne for an error
            const mockFindOne = jest.spyOn(StudentModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            // Call the function and expect error
            await expect(StudentService.verifyStudent('student@example.com'))
            .rejects
            .toThrow('Database error');

            expect(mockFindOne).toHaveBeenCalledWith({ stu_Email: 'student@example.com' });
        });
    }); */
});
