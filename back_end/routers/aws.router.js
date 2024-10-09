const express = require('express');
const multer = require('multer');
const awsController = require('../controller/aws.controller.js');
const router = express.Router();
const accessControl = require('../middleware/accessControl');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const authenticateToken = require('../middleware/auth'); 

// Swagger documentation added for each route

/**
 * @swagger
 * /api/upload:
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
router.post('/upload', authenticateToken, accessControl.isStudent ,upload.array('file'), awsController.uploadFiles);

/**
 * @swagger
 * /api/delete:
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

router.delete('/delete',  authenticateToken, accessControl.isAdmin ,awsController.deleteFile);

module.exports = router;
