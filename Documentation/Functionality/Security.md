# Security

![device-protected-by-cyber-security](https://github.com/user-attachments/assets/f58c7feb-1b3f-4944-9813-f67d24a129e6)

## JWT Tokens
Upon user login a JWT token is generated from a secret value inside an environmental variable, the JWT token is returned to the API request and must then be attached to all other API requests from the client. The JWT token is set to expire after 2 hours upon generating this token. The token is generated using the secret value, and also attaches email, password and type onto the token to ensure role based access control. 

## Role based Access

### Admin
Admin users have the most access to our API Endpoints. Admin users can act as both a student and lecturer and also have special privileges such as Lecturer creation and account deletion. 

### Lecturer
Leturers can only be created by Admin users. 
- Create assignments
- View student submissions
- Grade Submissions
- Give feedback on submissions
- View student videos
- Download student marks

### Student
Students are automatically assigned as a student upon registration. 
- Submit assignments
- record and upload videos