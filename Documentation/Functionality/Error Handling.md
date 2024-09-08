# Error handling for API requests

## Controller exports
In all controller files (assignment, lecturer, student, submission, user, video) the functions that get exported utilise try catches for error handling. They also include validation that is relevant to the spesific function itself. The functions are exported and can be used for API requests.