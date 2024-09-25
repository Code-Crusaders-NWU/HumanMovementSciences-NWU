# API Logging
![construction-warning-sign-icon-concept](https://github.com/user-attachments/assets/9fea6096-3869-4652-b3de-defd5fc06244)

For API logging we use a NodeJS library called Winston. Winston creates local API logging and stores them in a .log file. Each log file is created based on the model the service is using. For example all endpoints regarding the user model is stored in the user.log file. The Logging covers sucessfull API requests as well as failed ones. They are saved in seperate log files depending on the severity of the error and it's affect on the health of our server. 