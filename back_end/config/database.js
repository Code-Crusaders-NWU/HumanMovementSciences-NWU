const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();


async function connect(){
    try {
        await mongoose.connect(process.env.URI)
        //console.log("Successfully connected=> MongoDB")
    }
    catch (error){
        console.error("Error while connecting to MongoDB:"+error);
    }
}

connect();