# HumanMovementSciences-NWU

The NWU Human Movement Sciences Digital Platform is an integrated solution designed to enhance the accessibility and engagement of Human Movement Sciences resources at North West University. This project includes both a website and mobile application, aimed at providing students and faculty with a seamless experience to access information, resources, and tools related to the School of Human Movement Sciences. 

# For Developers:
![developers](https://github.com/user-attachments/assets/3d6672a0-0cac-48b2-8d07-edfb3fe9e72a)

## Backend integration on local devices

If you wish to replicate the work done by Code Crusaders or have a possible use case for this code base you can simply follow these commands to replicate this almost exact work environment on your local windows computer. 

### Clone HMS Repo with Git:
- Navigate to a directory of your choosing using a CLI (Command Line Interface):
- For example: 
    <pre>
    <code >CD C:\Projects</code>
    </pre>


- Inside your directory (While using CLI) paste the following command to clone our repo:

  <pre>
    <code >gh repo clone AndreP04/HumanMovementSciences-NWU</code>
    </pre>


 
### Setting up development environment 
Now that you've cloned our repo you can start by setting up the development environment to manipulate our codebase into your personal use case:



#### Install NodeJS:latest

Please follow the following instructions via the official Node documentation: 

[Node Installer Docs](https://nodejs.org/en/download/package-manager)

- To check if node is installed on your device run the following command: 

  <pre>
    <code >node -v</code>
    </pre>

#### Installing Node dependencies

- Firstly ensure your CLI directory is navigated towards the same directory where the package.json file is located.
- Simply run the following command to install all dependencies from the package file:

<pre>
    <code >npm install</code>
</pre>

![MongoDB_SpringGreen](https://github.com/user-attachments/assets/d66d697d-5c40-400d-885e-12c742aac813)

#### MongoDB setup:
- Create a MongoDB account with proper security rules and add copy the connection string. I recommend following the following tutorial: 

[MongoDB Connection Tutorial](https://www.youtube.com/watch?v=ACUXjXtG8J4&t=19s)

#### Create a .env file: 
- Simply add a .env file directly inside the "back_end" directory
- Inside the .env file add the following Environment Variables:

<pre>
<code>URI = 'YOUR MONGOOSE URL HERE'
PORT = 8000
TOKEN_KEY = 'INSERT SECURE PRIVATE KEY HERE'
</code>
</pre>

- Note: Please exchange your mongoDB connection string with the URI value and also provide a secure token_key value for endpoint encryption to allow only authorized  access
- Port is up to user requirements or preference  

### Start the NodeJS server:

 ![Node js_logo](https://github.com/user-attachments/assets/2856c612-40a7-4e6f-bac9-7d4fb35fd24a)


Copy one of the following command:
- Note: Using the first option allows an environment to be setup in which each save restarts the Node server automatically, I personally found this option to be much more confenient 
<pre>
<code>npm run dev</code>
</pre>

OR ALTERNATIVELY

<pre>
<code>node server</code>
</pre>


### Access API documentation:

After starting a server instance of the NodeJS backend navigate to the server on a local browser, such as Google Chrome or Firefox

- The URL should look something along the lines of: 


<pre>
<code>http://localhost:8001/api-docs/</code>
</pre>

- Note the localhost:8001 part, the 8001 could be different depending on what PORT the user assigned.




