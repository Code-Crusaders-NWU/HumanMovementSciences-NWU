# API Logging
![construction-warning-sign-icon-concept](https://github.com/user-attachments/assets/9fea6096-3869-4652-b3de-defd5fc06244)

For API logging we use a NodeJS library called Winston. Winston creates local API logging and stores them in a .log file. Each log file is created based on the model the service is using. For example all endpoints regarding the user model is stored in the user.log file. The Logging covers sucessfull API requests as well as failed ones. They are saved in seperate log files depending on the severity of the error and it's affect on the health of our server. 

The API performance is also logged in the api.log file. The logs include:
- Date and timestamps to identify when the event occured.
- Level identification to specify the severity of the log entry for example INFO or ERROR 
- HTTP method used, for example GET
- API responses for HTTP methods, for example 200
- Path to the relevant API endpoint 
- Response time in ms

