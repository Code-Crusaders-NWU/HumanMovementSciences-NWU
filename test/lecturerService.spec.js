const LecturerService = require('../back_end/services/lecturer.services');
const LecturerModel = require('../back_end/models/lecturer.model'); 
const dotenv = require('dotenv');

dotenv.config();

// Clears any mocked functions after each test
beforeEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of lecturerModel
jest.mock('../back_end/models/lecturer.model');

describe('LecturerService' , () => {

    //createLecturer Test
    describe('createLecturer', () => {

        it('should create a new lecturer when data is valid and lecturer does not exist', async () => {
            const lec_Email = 'test@example.com';
            const lec_Name = 'Pieter';
            const lec_Surname = 'Roux';
            const title = 'Dr.';
            const degree = 'PhD';

            //Mock the lecturerModel to simulate saving
            const mockSave = jest.fn().mockResolvedValue({lec_Email, lec_Name, lec_Surname, title, degree});
            LecturerModel.prototype.save = mockSave;

            //Mock the validation function
            const mockValidation = jest.spyOn(LecturerService, 'validation').mockImplementation(() => {});
            
            //Mock verifyLecturer function to return false (lecturer does not exist)
            const mockVerifyLecturer = jest.spyOn(LecturerService, 'verifyLecturer').mockResolvedValue(false);
    
            const result = await LecturerService.createLecturer(lec_Email, lec_Name, lec_Surname, title, degree);
    
            //Assertions
            expect(mockSave).toHaveBeenCalled();
            expect(mockValidation).toHaveBeenCalledWith(lec_Email, lec_Name, lec_Surname, title, degree);
            expect(mockVerifyLecturer).toHaveBeenCalledWith(lec_Email);
            expect(result).toEqual({lec_Email, lec_Name, lec_Surname, title, degree});
        });
    
        it('should throw an error if lecturer already exists', async () => {
            // if mockverify returns true, then lecturer exists.
            const mockVerifyLecturer = jest.spyOn(LecturerService, 'verifyLecturer').mockResolvedValue(true);
    
            await expect(LecturerService.createLecturer(
                'test@example.com', 'Pieter', 'Roux', 'Dr.', 'PhD'
            ))
            .rejects
            .toThrow('A lecturer with these credentials already exists');
    
            expect(mockVerifyLecturer).toHaveBeenCalledWith('test@example.com');
        });
    
        it('should throw a validation error if inputs are invalid', async () => {
            const mockValidation = jest.spyOn(LecturerService, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });
    
            await expect(LecturerService.createLecturer(
                'invalid-email', 'Pieter', 'Roux', 'Dr.', 'PhD'
            ))
            .rejects
            .toThrow('Validation failed');
    
            expect(mockValidation).toHaveBeenCalledWith('invalid-email', 'Pieter', 'Roux', 'Dr.', 'PhD');
        });

    });

    //deleteLecturer Tests
    describe('deleteLecturer', () => {
    
        it('should delete a lecturer if the lecturer exists', async () => {
            //mock findOne to get a lecturer
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue({
                lec_Email: 'test@example.com',
                lec_Name: 'Pieter',
                lec_Surname: 'Roux',
                title: 'Dr.',
                degree: 'PhD'
            });
    
            // Mock the deleteOne method and simulate it.
            const mockDeleteOne = jest.spyOn(LecturerModel, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
    
            //Call deleteLecturer function
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
    
        it('should properly handle and throw errors ', async () => {
            // Mock the findOne for error
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });
    
            await expect(LecturerService.deleteLecturer('error@example.com'))
            .rejects
            .toThrow('Database error');
    
            // Verify correct calling
            expect(mockFindOne).toHaveBeenCalledWith({ lec_Email: 'error@example.com' });
        });
    });

    //verifyLecturer Tests
    describe('verifyLecturer', () => {
        
        it('should return true if the lecturer exist', async () => {
            //Mock findOne to return a lecturer
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue({
                lec_Email: 'lecturer@example.com',
                lec_Name: 'Pieter',
                lec_Surname: 'Roux', 
                title: 'Dr.', 
                degree: 'PhD'
            });

            //Call the verifyLecturer function
            const result = await LecturerService.verifyLecturer('lecturer@example.com');

            //Assertions
            expect(mockFindOne).toHaveBeenCalledWith({lec_Email: 'lecturer@example.com'});
            expect(result).toBe(true);
        });

        it('should return false if the lecturer does not exist', async () => {
            //Mock findOne to return null
            const mockFindOne = jest.spyOn(LecturerModel, 'findOne').mockResolvedValue(null);

            const result = await LecturerService.verifyLecturer('lecturer@example.com');

            //Assertions
            expect(mockFindOne).toHaveBeenCalledWith({lec_Email: 'lecturer@example.com'});
            expect(result).toBe(false);
        });
    });

});//Class describe


 