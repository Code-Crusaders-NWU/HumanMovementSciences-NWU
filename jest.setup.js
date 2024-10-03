const {MongoMemoryServer} = require("mongodb-memory-server")
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    //Start an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    //Connect Mongoose to the in-memory MongoDB instance
    await mongoose.connect(uri);
});

afterAll(async () => {
    //Disconnect from the in-memory MongoDB and stop the server
    await mongoose.disconnect();
    await mongoServer.stop();
});