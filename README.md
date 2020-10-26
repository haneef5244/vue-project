# vue-project
Front end project for Demo

# How to install
-
Installation of npm is required - 
For windows : You may download it from https://nodejs.org/en/download/
For mac : You may run the following command : 'brew install node'
In this demo, I'm using Quasar framework as the CSS framework - Command to install quasar : 'npm install -g @quasar/cli'
After cloning the repository, you may open terminal & run 'npm install' in the directory
To start the quasar server, you may run 'quasar dev'

![alt text](https://i.ibb.co/601VPjj/Screenshot-2020-10-26-at-10-46-28-PM.png)
-
Above is picture when user reaches the base url of the website

![alt text](https://i.ibb.co/Rg0swqR/Screenshot-2020-10-26-at-10-46-42-PM.png)
-
Validation is added for valid email and valid password

![alt text](https://i.ibb.co/R6BhJB3/Screenshot-2020-10-26-at-10-46-51-PM.png)
-
User can also register a new account. However, in this system, only registration for USER role is allowed. I have created user with ADMIN role (can be found later in later section). Registration also has validation for a valid email, full name, and password

![alt text](https://i.ibb.co/P1k43YT/Screenshot-2020-10-26-at-10-47-01-PM.png)
![alt text](https://i.ibb.co/CwNpptr/Screenshot-2020-10-26-at-10-47-38-PM.png)
-
If registration passes all validations, registration of account will be made

![alt text](https://i.ibb.co/3spHWdn/Screenshot-2020-10-26-at-10-47-48-PM.png)
-
Above example shows the results if user tries to register an email that is already being used. In this system, id and email are the unique ids

![alt text](https://i.ibb.co/PrmJrbz/Screenshot-2020-10-26-at-10-48-02-PM.png)
-
Once registration is completed, passwords are hashed in the database. For this demo, I'm using bcrypt library to hash & compare the password

![alt text](https://i.ibb.co/3WQC6pt/Screenshot-2020-10-26-at-10-52-25-PM.png)
![alt text](https://i.ibb.co/vHc6qn5/Screenshot-2020-10-26-at-10-52-35-PM.png)
-
This is the USER role view in the system. User is able to find repositores either based on language or topic and the results are paginated. Each time the user performs a search, the keyword will be recorded in the database and can be seen in admin view (later shown in this readme)

![alt text](https://i.ibb.co/6rHjw6w/Screenshot-2020-10-26-at-10-52-44-PM.png)
-
User can by clicking on the log out button in the top left bar menu. Each time a user logs out, the session created in the back end is destroyed and server will no longer remember the session. For this demo, I'm using express-session for session handling. Each time a user logs in, a session will be created by the server in the sessions table.

![alt text](https://i.ibb.co/wSMBMkg/Screenshot-2020-10-26-at-10-53-04-PM.png)
-
And finally, this is the ADMIN role view. This view provides a simple report for the admin to view searches based on category (language and topic), as well as trending searches in the past 1 hour.

# CREDENTIALS
Admin role 

username : admin@gmail.com

password : 123qwe!@#QWE

User role

username : user@gmail.com

password : 123qwe!@#QWE
