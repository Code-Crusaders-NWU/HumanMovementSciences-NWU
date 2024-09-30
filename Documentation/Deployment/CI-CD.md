# CI/CD PIPELINE DOCUMENTATION:

![cloud-computing-storage-data-network](https://github.com/user-attachments/assets/f2f71668-7170-4056-a75c-4a42c4c1d263)

## Continious Integration:


## Continious Deployment:

We have utilised GitHub Actions to automate our deployment to Google Cloud. This process is configured to occur on each successful commit to the main branch. Our team is very strict with commits to the main branch and we primarily work on alternative branches such as our backend branch for the backend portion of the code. We have automated unit tests for each Git commit to the backend branch to test a large area of our codebase for a large variety of scenarios which could force an error. When these unit tests return positive one of our developers can place a pull request and then another developer can accept and merge this request into the main branch. 

When a main branch commit occurs a Docker image is created from the backend dockerfile and then a container is shipped to gCloud and hosted on Google's Cloud Run. The docker image receives sensitive data such as our MongoDB connection string and JWT token key from GitHub secrets as environment variables. Traffic on gCloud is automatically diverted to the newer container and scalability is instantaneous with large amounts of requests. This container hosts our NodeJS server with all the Secure API endpoints.
