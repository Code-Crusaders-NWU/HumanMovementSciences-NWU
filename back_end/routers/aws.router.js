const express = require('express');
const multer = require('multer');
const S3Controller = require('../controllers/s3Controller');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Swagger documentation added for each route

/**
 * @swagger
 * /api/s3/upload:
 *   post:
 *     summary: Upload files to S3
 *     description: Upload multiple files to AWS S3 and get their URLs in response.
 *     tags:
 *       - S3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 fileLinks:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "https://bucket.s3.region.amazonaws.com/Uploads/uuid-filename"
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.array('file'), S3Controller.uploadFiles);

/**
 * @swagger
 * /api/s3/delete:
 *   delete:
 *     summary: Delete a file from S3.
 *     description: Deletes a file from AWS S3 using the file URL.
 *     tags:
 *       - S3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 description: URL of the file to be deleted
 *                 example: "https://bucket.s3.region.amazonaws.com/Uploads/uuid-filename"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       500:
 *         description: Server error
 */

router.delete('/delete', S3Controller.deleteFile);

module.exports = router;
