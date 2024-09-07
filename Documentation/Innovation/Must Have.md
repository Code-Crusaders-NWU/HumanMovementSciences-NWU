# Contains
- Secure Login
- Data Store
- Providing Feedback on Video
- Assignment Creation

## Secure login:
- Sign up
- Account deletion
- Login functionality
- Validation

### Sign up:
When a user signs up they have to enter their email, password and user type. The input data is validated to ensure that it is in the correct format. Then their email is checked to see if they are already signed up. If they are not already signed up their info is saved to the database.

### Account deletion:
Validation to confirm the existence of user to be deleted. If the user exists their data is removed from the database.

### Login
Gets email and password from API BODY. Validation to see if the user exists. The password entered is compared with the password that is encrypted using Bcrypt hashing library in the database. If they match a login token is created and the user gets logged in.


## Data Store
Data store documentation is under Storage in backend branch.

## Providing feedback on video
The particular assignment that is going to get feedback is found by using the assignment number and student email. There is validation to determine if such a submission exists. Feedback can be given to on assignment and is saved to the database.

## Assignment creation
To create an assignment the assignment number, assigned date, due date, grade and lecturer email are all needed. Those inputs are all validated to ensure that they are either in the correct format or in the case of lecturer email that they exist. There is validation to ensure that the same assignment isnt created twice. If all validation criteria is passed the assignment is created and stored in the database.
