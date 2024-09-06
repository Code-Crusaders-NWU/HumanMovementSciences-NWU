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
    
            const mockLecturerModel = jest.spyOn(LecturerModel.prototype, 'save').mockImplementation(mockSave);
    
            const mockValidation = jest.spyOn(LecturerService.prototype, 'validation').mockImplementation(() => {});
            const mockVerifyLecturer = jest.spyOn(LecturerService.prototype, 'verifyLecturer').mockResolvedValue(false);
    
            const result = await LecturerService.createLecturer(
                'test@example.com', 'John', 'Doe', 'Dr.', 'PhD'
            );
    
            //Assertions
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
            const mockVerifyLecturer = jest.spyOn(LecturerService.prototype, 'verifyLecturer').mockResolvedValue(true);
    
            await expect(LecturerService.createLecturer(
                'test@example.com', 'John', 'Doe', 'Dr.', 'PhD'
            )).rejects.toThrow('A lecturer with these credentials already exists');
    
            expect(mockVerifyLecturer).toHaveBeenCalledWith('test@example.com');
        });
    
        it('should throw a validation error if inputs are invalid', async () => {
            const mockValidation = jest.spyOn(LecturerService.prototype, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });
    
            await expect(LecturerService.createLecturer(
                'invalid-email', 'John', 'Doe', 'Dr.', 'PhD'
            )).rejects.toThrow('Validation failed');
    
            expect(mockValidation).toHaveBeenCalledWith('invalid-email', 'John', 'Doe', 'Dr.', 'PhD');
        });

    });

    //deleteLecturer Tests
    describe('deleteLecturer', () => {
    
        it('should delete a lecturer when the lecturer exists', async () => {
            //mock findOne to get a lecturer
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue({
                lec_Email: 'test@example.com',
                lec_Name: 'John',
                lec_Surname: 'Doe',
                title: 'Dr.',
                degree: 'PhD'
            });
    
            // Mock the deleteOne method and simulate it.
            const mockDeleteOne = jest.spyOn(LecturerModel, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
    
            const result = await LecturerService.deleteLecturer('test@example.com');
    
            //Assertions
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'test@example.com' });
            expect(mockDeleteOne).toHaveBeenCalledWith({ lec_Email: 'test@example.com' });
            expect(result).toEqual({ message: 'Lecturer deleted successfully' });
        });
    
        it('should throw an error if the lecturer does not exist', async () => {
            // Mock findOne method : return null = not found
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue(null);
    
            // vall function and expect error
            await expect(LecturerService.deleteLecturer('nonexistent@example.com')).rejects.toThrow('Specified lecturer not found');
    
            // verify correct calling
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'nonexistent@example.com' });
        });
    
        it('should properly handel and throw errors ', async () => {
            // Mock the findOne for error
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });
    
            await expect(LecturerService.deleteLecturer('error@example.com')).rejects.toThrow('Database error');
    
            // Verify correct calling
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'error@example.com' });
        });
    });

    // Testing verifyLecturer function
    it('should return true if the lecturer exists', async () => {
        // Mock findOne to return a lecturer if exists
        const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue({
            lec_Email: 'existing@example.com',
            lec_Name: 'Jane',
            lec_Surname: 'Doe'
        });

        const result = await LecturerService.verifyLecturer('existing@example.com');

        //Assertions
        expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'existing@example.com' });
        expect(result).toBe(true); 
    });

    it('should return false if the lecturer does not exist', async () => {
        // Mock findOne method : return null = not found
        const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue(null);

        const result = await LecturerService.verifyLecturer('nonexistent@example.com');

        //Assertions
        expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'nonexistent@example.com' });
        expect(result).toBe(false); 
    });

    it('should handle errors and throw them properly', async () => {
        // Mock findOne to throw an error.
        const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        // expect to throw database error.
        await expect(LecturerService.verifyLecturer('error@example.com')).rejects.toThrow('Database error');

        expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'error@example.com' });
    });


});


 