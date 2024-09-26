![2150169861](https://github.com/user-attachments/assets/6ba68d42-d089-47fc-8d73-6a91387d886d)


## Data Storage
The application makes use of a MongoDB database with Mongoose as the Object Data Modelling library. The models define schemas for each entity, including validation and relationships between data fields.

The schemas ensure data consistency by enforcing types and constraints (unique id's, required fields, and format validation).

an Amazon S3 bucket is used to store user uploads. It has its own seperate documentation.

## Data Handling and Processing
The data is managed primarily on the service layer. It handles creating, reading, updating, and deleting data. Each service works with their corresponding model and makes sure the application rules are correctly followed.

- Creation: Data is validated and checked before it is saved to the database.
- Retrieval: Data is retrieved using queries with specific filters.
- Deletion: Checks are in place to make sure that the entity exists and is valid for deletion.

- validator library and validation functions are also implemented to ensure data accuracy.

## Authentication and Access Control
Access control is strictly enforced through middleware to protect sensitive data. JSON Web Tokens (JWT) are used to make sure that only authorized users can access certain endpoints and data.
  
## Data Retrieval
Data retrieval happens through controller functions that handle incoming API requests. Controllers call the service functions to fetch the data from the database.

Error handling is used in all of the retrieval processes, returning the correct and appropriate responses.

## Data Integrity
The following is used to ensure data integrity:
- Validation: Data is validated both at the model and service functions before any data is processed (stored, updated, or deleted).
  
- Logging: logging is implemented to keep track of important operations. Logs shows us visible system behaviour and can assist with troubleshooting.

## Data Maintenance
- Error Handling: Errors encountered during data operations are caught and logged, the system then responds with appropriate HTTP status codes and error messages, helping maintain operational and functional reliability.
