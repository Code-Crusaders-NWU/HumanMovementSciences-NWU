const VideoService = require('../back_end/services/video.services');
const VideoModel = require('../back_end/models/video.model'); //Mock the model of user
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const validator = require('../back_end/services/video.services');

dotenv.config();

//Mock the random number generation
beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1234567); //This ensures the random number is always 1234567
});

// Clears any mocked functions after each test
afterEach(() => {
    jest.clearAllMocks();
});

//Mock all methods of userModel
jest.mock('../back_end/models/video.model');

describe('VideoService', () => {

    describe('createVideo', () => {

        it('should create a new video successfully', async () => {
            const vidData = {
                vid_Num: 1234567,
                stu_Email: 'student@example.com',
                vid_Link: 'http://example.com/video1',
                upload_Date: new Date(),
                assignm_Num: 12345
            }

            //Mock the database methods
            VideoModel.findOne = jest.fn().mockResolvedValue(null);
            VideoModel.prototype.save = jest.fn().mockResolvedValue(vidData)

            // Mock validation function
            jest.spyOn(VideoService, 'validation').mockImplementation(() => {});

            const result = await VideoService.createVideo(
                vidData.vid_Num,
                vidData.stu_Email,
                vidData.vid_Link,
                vidData.upload_Date,
                vidData.assignm_Num
            )

            // Assertions
            expect(result).toEqual(vidData);
        });

        it('should throw an error if the video already exists', async () => {
            const vidData = {
                vid_Num: 1234567,
                stu_Email: 'student@example.com',
                vid_Link: 'http://example.com/video1',
                upload_Date: new Date(),
                assignm_Num: 12345
            }

            // Mock validation function
            jest.spyOn(VideoService, 'validation').mockImplementation(() => {});

            // Mock the findOne method to return an existing video
            VideoModel.findOne = jest.fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(vidData);

            await expect(VideoService.createVideo (
                vidData.vid_Num,
                vidData.stu_Email,
                vidData.vid_Link,
                vidData.upload_Date,
                vidData.assignm_Num
            ))
            .rejects
            .toThrow('A video with this number already exists');
        });
    });

    describe('deleteVideo', () => {

        it('should successfully delete a video if it exists', async () => {
            const vid_Num = 1234567;

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
            const vid_Num = 1234567;

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
            const vid_Num = 1234567;

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


    //getVideoByVidNum Tests
    describe('getVideoByVidNum', () => {
        
        it('should return a video with the provided vid_Num', async () => {
            const vid_Num = 1234567;
            const mockVideo = {
                vid_Num: vid_Num,
                stu_Email: 'student@example.com',
                vid_Link: 'http://example.com/video1',
                upload_Date: new Date(),
                assignm_Num: 12345
            };

            //Mock VideoModel to return a video
            VideoModel.findOne.mockResolvedValue(mockVideo);

            const result = await VideoService.getVideoByVidNum(vid_Num);

            //Assertions
            expect(VideoModel.findOne).toHaveBeenCalledWith({ vid_Num });
            expect(result).toEqual(mockVideo);
        });

        it('should throw an error if no video is found with the provided vid_Num', async () => {
            const vid_Num = 1234567;

            //Mock VideoModel to return null (video not found)
            VideoModel.findOne.mockResolvedValue(null);

            //Assertions
            await expect(VideoService.getVideoByVidNum(vid_Num))
                .rejects
                .toThrow(`No video found with video number: ${vid_Num}`);
        });

        it('should throw a server error if something goes wrong', async () => {
            const vid_Num = 1234567;

            //Mock VideoModel to throw an error
            VideoModel.findOne.mockRejectedValue(new Error('Database error'));

            //Assertions
            await expect(VideoService.getVideoByVidNum(vid_Num))
                .rejects
                .toThrow('Database error');
        });
    });

}); //Class describe
