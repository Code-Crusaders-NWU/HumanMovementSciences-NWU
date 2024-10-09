const {S3} = require("aws-sdk");                              //imported aws-sdk
const uuid = require("uuid").v4;                              //imported uui for name handeling

const s3 = new S3()


exports.s3UploadV2 = async(files) => {             
    
    //params is an array of all different files
    const params = files.map(file => {
        return {
         Bucket: process.env.AWS_BUCKET_NAME,                //gets info from env file
         Key: `Uploads/${uuid()}-${file.originalname}`,      //name of file to be uploaded
         Body: file.buffer,
         ContentDisposition: 'inline',
         ContentType: file.mimetype 
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

exports.deleteFromBucket = async (fileUrl) => {
    try {
        //get bucket name
        const bucketName = process.env.AWS_BUCKET_NAME;

        //decode link
        const fileKey = decodeURIComponent(fileUrl.split('.amazonaws.com/')[1]); // Extract the S3 key
        

        //needed parameters
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        }

        //actual deletion
        const del = await s3.deleteObject(params).promise();

        console.log("Success")
        return del


    } catch(err){
        console.error("Something went wrong:",err);
        throw err;

    }
};