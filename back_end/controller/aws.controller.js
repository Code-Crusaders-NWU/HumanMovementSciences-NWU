const S3Service = require('../services/s3Service');

exports.uploadFiles = async (req, res, next) => {
    try {
        const fileLinks = await S3Service.uploadFiles(req.files);
        return res.status(200).json({ status: true, fileLinks });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.deleteFile = async (req, res, next) => {
    try {
        const { fileUrl } = req.body;
        await S3Service.deleteFile(fileUrl);
        return res.status(200).json({ status: true, message: 'File deleted successfully' });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};
