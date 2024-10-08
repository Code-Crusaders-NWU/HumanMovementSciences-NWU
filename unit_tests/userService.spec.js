const UserService = require('../back_end/services/user.services');
const UserModel = require('../back_end/models/user.model'); //Mock the model of user
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of userModel
jest.mock('../back_end/models/user.model');

describe('UserService', () => {

    //signUp Tests
    describe('signUp', () => {

        it('should sign up a new user successfully', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user_type = 'student';

            //Mock validation function
            jest.spyOn(UserService, 'validation').mockImplementation(() => {});

            //Mock the findOne method to return null (no existing user)
            jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

            //Mock the save method for creating a new user
            const mockSave = jest.fn().mockResolvedValue({email, password, user_type});
            UserModel.prototype.save = mockSave;

            //Call signUp method
            const result = await UserService.signUp(email, password, user_type);
            
            //Assertions
            expect(UserService.validation).toHaveBeenCalledWith(email, password, user_type);
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({email, password, user_type});
        });

        it('should throw an error if the user already exists', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user_type = 'student';

            //Mock validation function
            jest.spyOn(UserService, 'validation').mockImplementation(() => {});

            //Mock the findOne method to return a existing user
            UserModel.findOne = jest.fn().mockResolvedValue({email});

            await expect(UserService.signUp(email, password, user_type))
            .rejects
            .toThrow('This email address is already a member');

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(UserModel.prototype.save).not.toHaveBeenCalled(); //No user should be saved
        });

        it('should throw an error if validation fails', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user_type = 'student';

            //Mock validation function to throw an error
            jest.spyOn(UserService, 'validation').mockImplementation(() => {
                throw new Error('Validation failed');
            });
        });
    });

    //deleteUser Tests
    describe('deleteUser', () => {
        
        it('should delete a user successfully if the user exists', async () => {
            const email = 'user@example.com';

            //Mock the findOne method to return a existing user
            jest.spyOn(UserModel, 'findOne').mockResolvedValue({email});

            //Mock deleteOne to simulate the deletion of a user
            jest.spyOn(UserModel, 'deleteOne').mockResolvedValue({deletedCount: 1});

            //Call the deleteUser method
            const result = await UserService.deleteUser(email);

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(UserModel.deleteOne).toHaveBeenCalledWith({email});
            expect(result).toEqual({message: 'User deleted successfully'});
        });

        it('should throw an error if the user does not exist', async () => {
            const email = 'user@example.com';

            //Mock the findOne method to return null (user not found)
            jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

            //Call the deleteUser method and expect it to throw an error
            await expect(UserService.deleteUser(email))
            .rejects
            .toThrow('Specified user not found');

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(UserModel.deleteOne).not.toHaveBeenCalled(); //deleteOne should not be called if the user does exist
        });
    });

    //verifyUser Tests
    describe('verifyUser', () => {

        it('should return the specified user if they exist', async () => {
            const email ='test@example.com';
            const mockUser = {email, password: 'password234', user_type: 'lecturer'};

            //Mock the findOne method to return the user
            jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockUser);

            //Call the verifyUser function
            const result = await UserService.verifyUser(email);

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(result).toEqual(mockUser);
        });

        it('should return null if the user does not exist', async () => {
            const email = 'user@example.com';

            //Mock the findOne method to return null (user not found)
            jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

            //Call the verifyUser function
            const result = await UserService.verifyUser(email);

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
            expect(result).toBeNull();
        });

        it('should throw an error when a database error occurs', async () => {
            const email = 'user@example.com';
            const dbError = new Error('Database error');

            //Mock the findOne method to throw an error
            jest.spyOn(UserModel, 'findOne').mockRejectedValue(dbError);

            //Call the verifyUser method and expect it to throw an error
            await expect(UserService.verifyUser(email))
            .rejects
            .toThrow('Database error');

            //Assertions
            expect(UserModel.findOne).toHaveBeenCalledWith({email});
        });
    });


    //getAllUsers Tests
    describe('getAllUsers', () => {

        it('should return a list of users with their roles', async () => {
            const mockUsers = [
                { email: 'user1@example.com', user_type: 'lecturer' },
                { email: 'user2@example.com', user_type: 'student' }
            ];
    
            UserModel.find.mockResolvedValue(mockUsers);
    
            const result = await UserService.getAllUsers();
    
            //Assertions
            expect(UserModel.find).toHaveBeenCalledWith({}, 'email user_type');
            expect(result).toEqual(mockUsers);
        });
    
        it('should throw an error if no users are found', async () => {
            UserModel.find.mockResolvedValue([]);
    
            await expect(UserService.getAllUsers()).rejects.toThrow('No users found');
            expect(UserModel.find).toHaveBeenCalledWith({}, 'email user_type');
        });
    
        it('should throw an error if the database query fails', async () => {
            UserModel.find.mockRejectedValue(new Error('Database Error'));
    
            await expect(UserService.getAllUsers()).rejects.toThrow('Database Error');
        });
        
    });

}); //Class descibe