
## 1. User Registration (Sign-Up)

The signUp method allows new users to register by providing their email, password, and user type ("student" or "lecturer").

### Email Validation
- The system validates if the email format is correct and has a length between 5 and 50 characters.

### Password Validation
- Passwords has to be between 8 and 30 characters.

### User Type Validation
- The user chooses their role as either "student" or "lecturer".

### Duplicate Email Check
- Before creating a new user, the system checks the database to see if a user exists already.

### Database Entry
- Once validated, the user's details (email, hashed password, and user type) are saved in the database.

## 2. User Login

### Extracting Login Credentials
   - The email and password are extracted from the request body ( req.body ) when someone attempts to log in via the API.

### User Verification
   - The UserService.verifyUser(email) method checks if a user already exists in the database.
   - If no user exists, they need to sign up first.
   
### Password Check
   - If the user exists, the passwordcheck method is called to ensure the passwords match.
   - If the entered password doesn't match, an error is thrown. 

### Token Creation
   - If the password matches, a token is created using JWT (JSON Web Token). 
   - The token includes the user’s ID and email, with an expiration time of 2 hours.
   - The createToken method from UserService is used to allocate the token with the secret key.

### Error Handling
   - Try catch is used for error handeling.

## 3. Logout