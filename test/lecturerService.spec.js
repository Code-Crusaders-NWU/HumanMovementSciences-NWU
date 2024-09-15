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

        it('should create a new lecturer successfully', async () => {
            const lec_Email = 'test@example.com';
            const lec_Name = 'Pieter';
            const lec_Surname = 'Roux';
            const title = 'Dr.';
            const degree = 'PhD';

            //Mock the validation function
            jest.spyOn(LecturerService, 'validation').mockImplementation(() => {});
            
            //Mock findOne method to return null (lecturer does not exist)
            jest.spyOn(LecturerModel, 'findOne').mockResolvedValue(null);

            //Mock the save method to simulate saving a new lecturer
            const mockSave = jest.fn().mockResolvedValue({lec_Email, lec_Name, lec_Surname, title, degree});
            LecturerModel.prototype.save = mockSave;
    
            //Call createLecturer function
            const result = await LecturerService.createLecturer(lec_Email, lec_Name, lec_Surname, title, degree);
    
            //Assertions
            expect(mockSave).toHaveBeenCalled();
            expect(LecturerService.validation).toHaveBeenCalledWith(lec_Email, lec_Name, lec_Surname, title, degree);
            expect(LecturerModel.findOne).toHaveBeenCalledWith({lec_Email});
            expect(result).toEqual({lec_Email, lec_Name, lec_Surname, title, degree});
        });
    
        it('should throw an error if the lecturer already exists', async () => {
           
            //Mock findOne methopd to return an existing lecturer
            jest.spyOn(LecturerModel, 'findOne').mockResolvedValue({
                lec_Email: 'lecturer@example.com',
                lec_Name: 'Pieter',
                lec_Surname: 'Roux',
                title: 'Dr.',
                degree: 'PhD'
            });

            await expect(LecturerService.createLecturer('lecturer@example.com', 'Pieter', 'van Wyk', "Dr.", "PhD"))
            .rejects
            .toThrow('A lecturer with these credentials already exists');

            expect(LecturerModel.findOne).toHaveBeenCalledWith({lec_Email: 'lecturer@example.com'});
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

});//Class describe


 