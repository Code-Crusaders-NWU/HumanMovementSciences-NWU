const request = require('supertest')
const express = require('express')
const VideoRouter = require('../back_end/routers/video.routers')
const VideoService = require('../back_end/services/video.services')

//Mock videoService
jest.mock('../back_end/services/video.services')

//Mock validation token
jest.mock('../back_end/middleware/auth', () => (req, res, next) => {
    req.user = {user_type: 'student'};
    next();
});

//Mock access control of student and lecturer
jest.mock('../back_end/middleware/accessControl', () => ({
    isStudent: (req, res, next) => {
        req.user = { user_type: 'student' }; // Mock user type as student for student routes
        next();
    },
    isLecturer: (req, res, next) => {
        req.user = { user_type: 'lecturer' }; // Mock user type as lecturer for lecturer routes
        next();
    }
}));

const app = express();
app.use(express.json());
app.use('/api', VideoRouter);

describe('Video API Implementation Tests', () => {

    //Video upload tests
    describe('POST /api/video', () => {

        it('should successfully upload a video', async () => {
            const reqBody = {
                vid_Num: 1,
                stu_Email: 'student@example.com',
                vid_Link: 'https://hmsapp.com/video.mp4',
                upload_Date: '2024-09-08T14:30:00.000Z',
                assignm_Num: 2
            };

            VideoService.createVideo.mockResolvedValue(reqBody);

            const response = await request(app)
            .post('/api/video')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Video uploaded successfully');
            expect(VideoService.createVideo).toHaveBeenCalledWith(
                reqBody.vid_Num,
                reqBody.stu_Email,
                reqBody.vid_Link,
                reqBody.upload_Date,
                reqBody.assignm_Num
            );
        });

        it('should return 500 if video upload fails', async () => {
            const reqBody = {
                vid_Num: 1,
                stu_Email: 'student@example.com',
                vid_Link: 'https://hmsapp.com/video.mp4',
                upload_Date: '2024-09-08T14:30:00.000Z',
                assignm_Num: 2
            };

            //Mock createVideo to throw an error
            VideoService.createVideo.mockRejectedValue(new Error('Failed to upload video'));

            const response = await request(app)
            .post('/api/video')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during video upload');
            expect(response.body.error).toBe('Failed to upload video');
        });
    });


    //Video delete tests
    describe('DELETE /api/video', () => {

        beforeEach(() => {
            jest.spyOn(VideoService, 'deleteVideo');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
        
        it('should successfully delete a video', async () => {
            const reqBody = {vid_Num: 1};

            //Mock deleteVideo to resolve successfully
            VideoService.deleteVideo.mockResolvedValue({message: 'Video deleted successfully'});

            const response = await request(app)
            .delete('/api/video')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe('Video deleted successfully');
            expect(VideoService.deleteVideo).toHaveBeenCalledWith(1);

        });

        it('should return 500 if video deletetion fails', async () => {
            const reqBody = {vid_Num: 1};

            //Mock deleteVideo to throw an error
            VideoService.deleteVideo.mockRejectedValue(new Error('Failed to delete video'));

            const response = await request(app)
            .delete('/api/video')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('An error has occurred during video deletion');
            expect(response.body.error).toBe('Failed to delete video');
        });

        it('should return 404 if video is not found', async () => {
            const reqBody = {vid_Num: 1};

            //Mock delelteVideo to throw an error
            VideoService.deleteVideo.mockRejectedValue(new Error('Specified video not found'));

            const response = await request(app)
            .delete('/api/video')
            .send(reqBody);

            //Assertions
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Specified video not found')
        }); 
    });

}); //Class describe