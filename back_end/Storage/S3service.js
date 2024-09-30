const {S3} = require("aws-sdk");                              //imported aws-sdk
const uuid = require("uuid").v4;                              //imported uui for name handeling


exports.s3UploadV2 = async(files) => {             
    const s3 = new S3();                                     //initialize s3 const

    //params is an array of all different files
    const params = files.map(file => {
        return {
         Bucket: process.env.AWS_BUCKET_NAME,                //gets info from env file
         Key: `Uploads/${uuid()}-${file.originalname}`,      //name of file to be uploaded
         Body: file.buffer,
        };
    })

    return await Promise.all(params.map(param => s3.upload(param).promise()));


};