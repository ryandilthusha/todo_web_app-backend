//=================== The code for the Todo app backend =========================


/*===============================================================================
1) Module Imports:
This section imports the necessary modules for the server to function.
*/

// Import Express to enable the creation of an HTTP server for our Todo app backend.
const express = require('express');
// Import CORS to allow our Todo app frontend (running on a different port or domain) to interact with this backend.
const cors = require('cors');

/* Removing Pool since we are now using db.js for database interactions -->

Import the 'Pool' class from the 'pg' module, which is necessary for creating a pool of connections to the PostgreSQL database.
//const { Pool } = require('pg'); //Pool class is created below when defining a function to open a new database connection pool.*/


// Load environment variables from .env file
require('dotenv').config();


// Import the router from todo.js
const todoRouter = require('./routes/todo.js');

/*===============================================================================
2) Configuration:
This section sets up the server configuration, like the port number and the database connection pool function.
*/

// Define the port number that our backend server will listen on. This is where our Todo app backend will accept HTTP requests.
// Set the server port from environment variable OR use 3000 as default
const port = process.env.PORT || 3000;     //Without .env file -->  const port = 3001;


/* This part moved to db.js file after introducing .env file -->

Define a function to open a new database connection pool.
const openDb = function()
{
    // Create a new pool instance with configuration settings for the PostgreSQL database.
    const pool = new Pool({
      //At here the data is read by .env file (for security reason)
        user: process.env.DB_USER,      // The default superuser of the PostgreSQL database.
        host: process.env.DB_HOST,     // The server hosting the PostgreSQL database (localhost for the local machine).
        database: process.env.DB_NAME,      // The name of the database to connect to.
        password: process.env.DB_PASSWORD,      // The password for the database user (ensure this is secure in production).
        port: process.env.DB_PORT,            // The port where the PostgreSQL server is listening (5432 is the default).
    });

    // Return the pool object to allow the calling code to use this pool to make database connections.
    return pool;
}
*/


/*===============================================================================
3) Middleware Setup:
This section applies middleware used by the Express application, such as CORS and JSON body parsing.
*/

// Creates the Express application to set up our HTTP server.
const app = express();


// Apply CORS middleware to our Express app to handle cross-origin requests, ensuring the frontend can safely make requests to this backend.
app.use(cors());
// Middleware to parse incoming JSON payloads
app.use(express.json());


// This had to introduce because of DELETE Route
// This adds middleware to parse URL-encoded bodies (as sent by HTML forms).
// Since id for the deleted task is passed as a part of url, we need to this so that express can read parameters from url address.
app.use(express.urlencoded({extended: false}));


// Use the todoRouter for all todo related endpoints
app.use('/', todoRouter);










/*===============================================================================
5) Server Initialization:
This section starts the server, allowing it to listen for incoming requests.
*/

// Start listening for incoming HTTP requests on the defined port. This effectively starts our Todo app backend server.
// Adding a console log to indicate the server is running and on which port, providing immediate feedback in the development environment.
app.listen(port, () => {
  console.log(`Todo app backend server running on port ${port}`);
});
