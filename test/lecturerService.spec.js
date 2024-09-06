const LecturerService = require('../back_end/services/lecturer.services');
const LecturerModel = require('../back_end/models/lecturer.model'); //Mock the model of lecturer
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
jest.mock('../back_end/models/lecturer.model');


describe('LecturerService' , () => {
    //create lecturer test.
    describe('createLecturer', () => {
        it('should create a new lecturer when data is valid and lecturer does not exist', async () => {
            const mockSave = jest.fn().mockResolvedValue({
                lec_Email: 'test@example.com',
                lec_Name: 'John',
                lec_Surname: 'Doe',
                title: 'Dr.',
                degree: 'PhD'
            });
    
            const mockLecturerModel = jest.spyOn(Lecturer_Model.prototype, 'save').mockImplementation(mockSave);
    
            const mockValidation = jest.spyOn(SomeClass.prototype, 'validation').mockImplementation(() => {});
            const mockVerifyLecturer = jest.spyOn(SomeClass.prototype, 'verifyLecturer').mockResolvedValue(false);
    
            const result = await SomeClass.createLecturer(
                'test@example.com', 'John', 'Doe', 'Dr.', 'PhD'
            );
    
            expect(mockValidation).toHaveBeenCalledWith('test@example.com', 'John', 'Doe', 'Dr.', 'PhD');
            expect(mockVerifyLecturer).toHaveBeenCalledWith('test@example.com');
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({
                lec_Email: 'test@example.com',
                lec_Name: 'John',
                lec_Surname: 'Doe',
                title: 'Dr.',
                degree: 'PhD'
            });
        });
    
        it('should throw an error if lecturer already exists', async () => {
            // if mockverify returnes true, then lecturer exists.
            const mockVerifyLecturer = jest.spyOn(SomeClass.prototype, 'verifyLecturer').mockResolvedValue(true);
    
            await expect(SomeClass.createLecturer(
                'test@example.com', 'John', 'Doe', 'Dr.', 'PhD'
            )).rejects.toThrow('A lecturer with these credentials already exists');
    
            expect(mockVerifyLecturer).toHaveBeenCalledWith('test@example.com');
        });
    
        it('should throw a validation error if inputs are invalid', async () => {
            const mockValidation = jest.spyOn(SomeClass.prototype, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });
    
            await expect(SomeClass.createLecturer(
                'invalid-email', 'John', 'Doe', 'Dr.', 'PhD'
            )).rejects.toThrow('Validation failed');
    
            expect(mockValidation).toHaveBeenCalledWith('invalid-email', 'John', 'Doe', 'Dr.', 'PhD');
        });

    });

    //deleteLecturer Tests
    describe('deleteLecturer', () => {
    
        it('should delete a lecturer when the lecturer exists', async () => {
            // Mock the findOne method to return an existing lecturer
            const mockFindOne = jest.spyOn(Lecturer_Model, 'findOne').mockResolvedValue({
                lec_Email: 'test@example.com',
                lec_Name: 'John',
                lec_Surname: 'Doe',
                title: 'Dr.',
                degree: 'PhD'
            });
    
            // Mock the deleteOne method to simulate deletion
            const mockDeleteOne = jest.spyOn(Lecturer_Model, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
    
            // Call the function
            const result = await SomeClass.deleteLecturer('test@example.com');
    
            // Verify that findOne and deleteOne were called with the correct arguments
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'test@example.com' });
            expect(mockDeleteOne).toHaveBeenCalledWith({ lec_Email: 'test@example.com' });
            expect(result).toEqual({ message: 'Lecturer deleted successfully' });
        });
    
        it('should throw an error if the lecturer does not exist', async () => {
            // Mock the findOne method to return null (lecturer not found)
            const mockFindOne = jest.spyOn(Lecturer_Model, 'findOne').mockResolvedValue(null);
    
            // Call the function and expect it to throw an error
            await expect(SomeClass.deleteLecturer('nonexistent@example.com')).rejects.toThrow('Specified lecturer not found');
    
            // Verify that findOne was called with the correct argument
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'nonexistent@example.com' });
        });
    
        it('should handle errors and throw them properly', async () => {
            // Mock the findOne method to throw an error
            const mockFindOne = jest.spyOn(Lecturer_Model, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });
    
            // Call the function and expect it to throw the database error
            await expect(SomeClass.deleteLecturer('error@example.com')).rejects.toThrow('Database error');
    
            // Verify that findOne was called with the correct argument
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'error@example.com' });
        });
    });

});


 