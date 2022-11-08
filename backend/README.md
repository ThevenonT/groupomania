## BACKEND 

## Groupomania 
This folder contains the backend of this app.
To start the server on your computer you need 
to clone the repository to this address `https://github.com/ThevenonT/groupomania.git`.
go to the backend folder and start the server.

# START THE SERVER
run `npm install` to install the dependencies and 
run `node run start` or `nodemon start` to start the backend server on `port: 3000`.

# PORT
`port 3000` must be free or specify the desired port in the environment file 

# MongoDB
mongoDb connection information must be filled in the environment file and wait for the connection response to mongoDb. 
Once the connection to mongoDB is established.

# MySql 
mySql connection information must be filled in the environment file and wait for the connection response to MySql. 
a database named 'mysql' must be present in the server at the first start of the application 
("this database is used by the application to create a database named 'groupomania'")
Once the connection to mySql is established, the server is operational.

# .env
a file named .env_default is present and contains a model of the environment variables necessary for operation 