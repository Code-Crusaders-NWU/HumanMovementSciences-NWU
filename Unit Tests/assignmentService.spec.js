const AssignmentService = require('../back_end/services/assignment.services');
const AssignmentModel = require('../back_end/models/assignments.model');
const dotenv = require('dotenv');

dotenv.config();

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of assignmentModel
jest.mock('../back_end/models/assignments.model');

describe('AssignmentService', () => {  

    //createAssignment Tests
    describe('createAssignment', () => {  

        it('should sucessfully create a new assignment', async () => {
            
            const assignmData = {
                assignm_Num: '1',
                assignm_Date: '2024-09-10T00:00:00Z',
                lec_Email: 'lecturer@example.com',
                grade: 90,
                due_date: '2024-09-12T00:00:00Z'
            };

            //Mock the database methods
            AssignmentModel.findOne = jest.fn().mockResolvedValue(null);
            AssignmentModel.prototype.save = jest.fn().mockResolvedValue(assignmData);

            const result = await AssignmentService.createAssignment(
                assignmData.assignm_Num,
                assignmData.assignm_Date,
                assignmData.lec_Email,
                assignmData.grade,
                assignmData.due_date
            )

            //Assertions
            expect(AssignmentModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                assignm_Num: '1',
                lec_Email: 'lecturer@example.com'
            }));
            expect(result).toEqual(assignmData);
        });

        it('should throw an error if the assignment already exists', async () => {
            
            const assignmData = {
                assignm_Num: '1',
                assignm_Date: '2024-09-10T00:00:00Z',
                assignm_Feedback: 'Great work!',
                stu_Email: 'student@example.com',
                lec_Email: 'lecturer@example.com',
                grade: 90,
                due_date: '2024-09-12T00:00:00Z'
            };

            //Mocking findOne to simulate an existing assignment
            AssignmentModel.findOne = jest.fn().mockResolvedValue(assignmData);

            await expect(AssignmentService.createAssignment(
                assignmData.assignm_Num,
                assignmData.assignm_Date,
                assignmData.lec_Email,
                assignmData.grade,
                assignmData.due_date
            ))
            .rejects
            .toThrow('An assignment with this number already exists');

            });
        

        it('should throw a validation error if if required fields are missing', async () => {
            
            AssignmentService.validation = jest.fn(() => {throw new Error('Validation failed'); });
            
            await expect(AssignmentService.createAssignment(
                '1',
                new Date(),
                null,
                null,
                null
            ))
            .rejects
            .toThrow('Validation failed');
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
                    assignm_Num: '1',
                    assignm_Date: '2023-09-01',
                    assignm_Feedback: 'Great work!',
                    stu_Email: 'student1@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 85,
                    due_date: '2023-09-10'
                },
                {
                    assignm_Num: '2',
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
                    assignm_Num: '1',
                    assignm_Date: '2023-09-01',
                    assignm_Feedback: 'Great work!',
                    stu_Email: 'student1@example.com',
                    lec_Email: 'lecturer@example.com',
                    grade: 85,
                    due_date: '2023-09-10'
                },
                {
                    assignm_Num: '2',
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
            const lec_Email = 'lecturer@example.com';

            // Mock find to return an empty array (no assignments found)
            AssignmentModel.find = jest.fn().mockResolvedValue(null);
    
            await expect(AssignmentService.viewAllAssignments(lec_Email))
            .rejects
            .toThrow('Specified lecturer has not created any assignments');
        });
    
        it('should handle errors and throw them properly', async () => {
            // Mock find to throw an error
            const mockFind = jest.spyOn(AssignmentModel, 'find').mockImplementation(() => {
                throw new Error('Database error');
            });
    
            // Call the function and expect it to throw the database error
            await expect(AssignmentService.viewAllAssignments('lecturer@example.com'))
            .rejects
            .toThrow('Database error');

            expect(mockFind).toHaveBeenCalledWith({ lec_Email: 'lecturer@example.com' });
        });
    });
});
