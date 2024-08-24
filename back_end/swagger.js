const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'HMS API',
version: '1.0.0',
description: 'API Documentation for performing CRUP RestAPI operations on HMS MongoDB database and interacting with the backend.',
},
};

const options = {
swaggerDefinition,
apis: ['./routes/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;