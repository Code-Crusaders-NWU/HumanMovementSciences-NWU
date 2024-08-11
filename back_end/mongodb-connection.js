//Import MongoClient from the mongodb package
const { MongoClient } = require('mongodb');

//Define an asynchronous funtion
async function main() {
    const uri = "mongodb+srv://admin:<password>@human-movement-sciences.udlit.mongodb.net/"
    const client = new MongoClient(uri);

    //Attempt to connect to the MongoDB server
    try {
        await client.connect();
        console.log("Connection successful");

        //Select the database to use
        const database = client.db('HumanMovementSciences');
        const collection = database.collection('admin');

        //Insert database operations here

    } finally {
        //Close the connection when done
        await client.close();
    }
}

//Call the main function to handle errors
main().catch(console.error);