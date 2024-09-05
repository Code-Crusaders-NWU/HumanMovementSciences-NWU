const VideoService = require('../back_end/services/video.services');
const VideoModel = require('../back_end/models/video.model'); //Mock the model of user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const validator = require('../back_end/services/video.services');

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
jest.mock('../back_end/models/video.model');

describe('VideoService', () => {

    describe('createVideo', () => {

        it('should create a new video successfully', async () => {
            const vid_Num = '1';
            const stu_Email = 'student@example.com';
            const vid_Link = 'http://example.com/video1';
            const upload_Date = new Date();
            const assignm_Num = '1';

            // Mock validation function
            jest.spyOn(VideoService, 'validation').mockImplementation(() => {});

            // Mock the findOne method to return null (no existing video)
            jest.spyOn(VideoModel, 'findOne').mockResolvedValue(null);

            // Mock the save method
            const mockSave = jest.fn().mockResolvedValue({
                vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num
            });
            const mockNewVideo = { save: mockSave };
            jest.spyOn(VideoModel.prototype, 'save').mockImplementation(mockSave);
            jest.spyOn(VideoModel, 'constructor').mockReturnValue(mockNewVideo);

            // Call createVideo method
            const result = await VideoService.createVideo(
                vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num
            );

            // Assertions
            expect(VideoModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
                vid_Num,
                stu_Email,
                vid_Link,
                upload_Date: expect.any(Date),
                assignm_Num
            }));
            expect(mockSave).toHaveBeenCalled();
            expect(result).toEqual({
                vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num
            });
        });

        it('should throw an error if the video already exists', async () => {
            const vid_Num = '1';
            const stu_Email = 'student@example.com';
            const vid_Link = 'http://example.com/video1';
            const upload_Date = new Date();
            const assignm_Num = '1';

            // Mock validation function
            jest.spyOn(VideoService, 'validation').mockImplementation(() => {});

            // Mock the findOne method to return an existing video
            jest.spyOn(VideoModel, 'findOne').mockResolvedValue({
                vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num
            });

            // Call createVideo method and expect an error
            await expect(VideoService.createVideo(
                vid_Num, stu_Email, vid_Link, upload_Date, assignm_Num
            )).rejects.toThrow('A video with this number already exists');
        });
    });

    describe('deleteVideo', () => {

        it('should successfully delete a video if it exists', async () => {
            const vid_Num = '1';

            //Mock the findOne method to return a video object (the video exists)
            jest.spyOn(VideoModel, 'findOne').mockResolvedValue({
                vid_Num
            });

            //Mock deleteOne method
            jest.spyOn(VideoModel, 'deleteOne').mockResolvedValue({});

            //Call deleteVideo method
            const result = await VideoService.deleteVideo(vid_Num);

            //Assertions
            expect(VideoModel.findOne).toHaveBeenCalledWith({vid_Num});
            expect(VideoModel.deleteOne).toHaveBeenCalledWith({vid_Num});
            expect(result).toEqual({message: 'Video deleted successfully'});
        });

        it('should through an error if the video does not exist', async () => {
            const vid_Num = '1';

            //Mock findOne method to return null (video does not exist)
            jest.spyOn(VideoModel, 'findOne').mockResolvedValue(null);

            //Call deleteVideo method and expect an error
            await expect(VideoService.deleteVideo(vid_Num))
            .rejects
            .toThrow('Specified video not found');

            //Ensure deleteOne is not called if the video does not exist
            expect(VideoModel.deleteOne).not.toHaveBeenCalled();
        });

        it('should handle errors thrown by the database', async () => {
            const vid_Num = '1';

            //Mock the findOne method to throw an error
            jest.spyOn(VideoModel, 'findOne').mockRejectedValue(new Error('Database error'));

            //Call deleteVideo method and expect an error
            await expect(VideoService.deleteVideo(vid_Num))
            .rejects
            .toThrow('Database error');

            //Ensure deleteOne is not called if findOne has an error
            expect(VideoModel.deleteOne).not.toHaveBeenCalled();
        });
    });
}); //Class describe
