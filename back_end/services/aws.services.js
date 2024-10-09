const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

const s3 = new S3();

class S3Service {
    static async uploadFiles(files) {
        try {
            const params = files.map(file => {
                return {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `Uploads/${uuid()}-${file.originalname}`,
                    Body: file.buffer,
                    ContentDisposition: 'inline',
                    ContentType: file.mimetype
                };
            });

            const uploadResults = await Promise.all(
                params.map(param => s3.upload(param).promise())
            );

            return uploadResults.map(result => {
                const encodeKey = encodeURIComponent(result.Key);
                return `https://${result.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeKey}`;
            });
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    static async deleteFile(fileUrl) {
        try {
            const bucketName = process.env.AWS_BUCKET_NAME;
            const fileKey = decodeURIComponent(fileUrl.split('.amazonaws.com/')[1]);

            const params = {
                Bucket: bucketName,
                Key: fileKey
            };

            const deleteResult = await s3.deleteObject(params).promise();
            return deleteResult;
        } catch (error) {
            throw new Error(`File deletion failed: ${error.message}`);
        }
    }
}

module.exports = S3Service;
