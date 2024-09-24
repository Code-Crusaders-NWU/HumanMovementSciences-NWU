# Authentication
Authentication is implemented so that only certain type of users can access or interact with certain parts of the system. This is done by using JWT (JSON Web Tokens) for secure access to all protected routes and endpoints.

## How The Authentication Works

###  User Login

 Extracting Login Credentials:
   - The email and password are extracted from the request body ( req.body ) when someone attempts to log in via the API.

 User Verification:
   - The UserService.verifyUser(email) method checks if a user already exists in the database.
   - If no user exists, they need to sign up first.
   
 Password Check:
   - If the user exists, the passwordcheck method is called to ensure the passwords match.
   - If the entered password doesn't match, an error is thrown. 

 Token Creation:
   - If the password matches, a JWT is generated using a secret key when a user logs in.
   - The token includes the user’s ID and email, with an expiration time of 2 hours.
   - This token is then sent back to the user, it is needed for any future requests.
   - The createToken method from UserService is used to allocate the token with the secret key.

Token Validation:
   - The application checks for the correct JWT in the request’s headers.
   - If token is valid, then the user is authenticated and the request is allowed to continue.
   - If the token is invalid (missing, expired, or incorrect) then the system denies access.


## Middleware for Authentication
The authentication process is managed by middleware:

- authenticateToken: This function checks for the correct JWT in the request’s headers, and if it's valid. If the token is invalid (missing, expired, or incorrect) then the system denies access. If token is valid, then the user is authenticated and the request is allowed to continue.

