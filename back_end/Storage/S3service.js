const {S3} = require("aws-sdk");                              //imported aws-sdk
const uuid = require("uuid").v4;                              //imported uui for name handeling

const s3 = new S3()


exports.s3UploadV2 = async(files) => {             
    
    //params is an array of all different files
    const params = files.map(file => {
        return {
         Bucket: process.env.AWS_BUCKET_NAME,                //gets info from env file
         Key: `Uploads/${uuid()}-${file.originalname}`,      //name of file to be uploaded
         Body: file.buffer
        };
    });

    const upRes = await Promise.all(
        params.map(param => s3.upload(param).promise())
    );

    //return URL to uploaded object
    const fileLinks = upRes.map(result =>{
        //takes into account that names can have spaces which will not work with a link and fixes that
        const encodeKey = encodeURIComponent(result.Key)
        return `https://${result.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeKey}`
    });
    


    return fileLinks;


};