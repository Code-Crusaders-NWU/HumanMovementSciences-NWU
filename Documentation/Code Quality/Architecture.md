![architecture-plan-blueprint-layout-work-concept](https://github.com/user-attachments/assets/465dbeb3-a3da-4a94-997b-b5a542044639)


# API Architecture
The code is separated into layers which utilizes RESTful principles to divide the Business Logic and API endpoints. There are 5 layers namely: Controller, Router, Services, Models and Middleware.

## The Layers of Architecture:
### Model
Model provides what we call a "blueprint" of what a data entity should look like. Take our user Model for example. Each User model has an email, which is a required attribute and must be lowercase. The user has a password which is also required and lowercase. And the user has a user type, also required. The database receives a model and knows in which table to place each model. When an API request is created it should follow the structure of each "blueprint" to create an entity. 

### Services

Services separated the business logic from API endpoint procedures. This includes services such as login, signup, delete, validation, verification etc. These files are saved in the services folder and have an extension .services.js to indicate it is a services file which is JavaScript. These services can simply be called by API endpoints to perform like the name suggests, a service to these endpoints.

### Controller

Controller is mainly responsible for handling the API request. When an API request is made it goes through Router file and then sent to the correct matching controller. The controller calls the relevant service for each endpoint, e.g. calling the login service which returns a secure JWT token when the login endpoint is called. Controller also handles the API logging in which all requests are stored in .log files with their corresponding error, success and info messages. 

### Router

The router file is primarily used to assign an identity to each endpoint and then also like the name suggests routes an API request through to the necessary controller. A large portion of the API routers first call middleware such as the validate token middleware which checks the validity of each JWT token before the router sends the request to the correct Controller and then calling each of the relevant and business logic from the services folder. 

### Middleware

Middleware provides a service to an API request before it is passed to the controller file to be processed. The middleware primarily consists of 2 files. The Token verification file, and access control. Token Verification checks if the JWT token attached to the API request is valid and if it has not yet expired. The Access control file determines the user type using the JWT token and if they have the access required to access this specific API endpoint.


## Authentication
JWT based authentication ensures that only authorized users can access certain information.

## ENDPOINTS
- Assignments: Endpoints for adding, removing and viewing assignments
- Lecturers: Endpoints for adding and removing lecturers
- Students: Endpoints for adding and removing students
- Submissions: Endpoints for submitting, viewing, downloading specific, grading, giving feedback on submissions
- Users: Endpoints for adding, deleting and login of users
- Videos: Endpoints for video uploads and deletions.

The endpoints utilizes methods like POST, GET, DELETE, PATCH

The API follows RESTful principles. Requests are separate and relies on the token passed by the client. All entities are represented as unique resources and accessed through HTTP methods.
