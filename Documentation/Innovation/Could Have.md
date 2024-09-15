# Contains
- Download marks and feedback per assignments
- Docker Containerization
- CI/CD Pipeline
- Cloud Hosting

## Download marks and feedback per assignments:
Lecturers can download the marks of all/spesific assignments in CSV format that includes the assignment number, student email, mark. There is two important functions in submission.services.js, namely getAllMarks and getAssignmentMarks. getAllMarks returns all submissions and their marks in CSV format. getAssignmentMarks returns the submissions and their grades of specified assignments. Both of these functions have their own functions in the submission.controller.js file. Those functions send the CSV files as downloads and are used in the routehandler.

### getAllMarks
- Gets all submissions from the database
- Stream for CSV data is created
- Relevant information is selected and written to the stream
- filepath for CSV file is returned

### getAssignmentMarks
- Receives assignment number as input
- Gets all submissions of the entered assignment from the database
- Relevant information is selected and written to the CSV stream
- filepath for CSV file is returned

