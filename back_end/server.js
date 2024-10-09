const express = require('express');
require("dotenv").config();
const multer = require("multer");
const {s3UploadV2, deleteFromBucket} = require("./Storage/S3service");
const uuid = require("uuid").v4;
const database = require('./config/database');
const userModel = require('./models/user.model');
const app = require('./app');

//Middleware
app.use(express.json());

const storage = multer.memoryStorage();

//File filter to allow image files only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_EXPECTED_FILE"), false);
    }
};

//Upload middleware for handling multiple files
const upload = multer({storage, fileFilter, limits: {fileSize: 1000000000}});

//Root route
app.get('/', (req, res) => {
    res.json({message: 'Code Crusaders HMS BACKEND'});
});

//File upload route
app.post("/upload", upload.array("file"), async (req, res) => {
    try {
        const results = await s3UploadV2(req.files); //Upload files to S3
        console.log(results);
        res.json({ status: "success", fileLinks: results }); //Respond with success and file links
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'File upload failed', error: err.message });
    }
});

//File delete route
app.delete("/delete-file", async (req, res) => {
    const { fileUrl } = req.body;

    try {
        // Call the delete function
        await deleteFromBucket(fileUrl);
        res.status(200).json({ message: "File deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "A problem occurred: ", details: error.message });
    }
});

// Error handling middleware for file upload errors
app.use((error, req, res, next) => { 
    if (error instanceof multer.MulterError) { 
       if (error.code === "LIMIT_FILE_SIZE") {
        return res.json({ message: "File is too large" });
       }
       if (error.code === "LIMIT_FILE_COUNT") {
        return res.json({ message: "File limit reached" });
       }
       if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.json({ message: "File is of the wrong type" });
       }
    }
    next(error); // If it's not a Multer error, pass it to the default error handler
});

//Started a Local Server on Port 8080
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log("Server started on port => " + PORT);
});


//To better close the server
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
 