# API Architecture

## Authentication
JWT based authentication ensures that only authorised users can access certain information.

## ENDPOINTS
- Assignments: Endpoints for adding, removing and viewing assignments
- Lecturers: Endpoints for adding and removing lecturers
- Students: Endpoints for adding and removing students
- Submissions: Endpoints for submitting, viewing, downloading spesific, grading, giving feedback on submissions
- Users: Endpoints for adding, deleting and login of users
- Videos: Endpoints for video uploads and deletions.

The endpoints utilises methods like POST, GET, DELETE, PATCH

The API follows RESTful principles. Requests are seperate and relies on the token passed by the client. All entities are represented as unique resources and accessed through HTTP methods.
