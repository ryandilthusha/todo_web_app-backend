/* WHAT HAS SHIFTED TO todo.js?
The GET, POST, and DELETE routes for handling todo items have been moved from the main index.js file to a new file todo.js. 
These routes include the logic for fetching all todos, creating a new todo, and deleting an existing todo.

WHY THE SHIFT WAS MADE:
This helps organize the code by functionality.
This makes the main index.js file cleaner and easier to read, with a focus on initial server configuration and middleware.
*/


// Import express and destruct the Router class from it
const express = require('express');
const { query } = require('../helpers/db.js'); 


// Create a new router object to handle routes for todo-related endpoints
const todoRouter = express.Router();



/*===============================================================================
4) Route Definitions:
This section defines the HTTP routes the server will respond to (GET and POST endpoints).
*/



/*
1. First check this block of code.
// Set up a route handler for HTTP GET requests to the root ("/") path. 
//This route could be used for health checks or initial API verification.
app.get('/', function(req, res) {
    // Respond with a JSON object and a 200 OK status code to indicate the backend is successfully running and reachable.
    res.status(200).json({result: 'success'});
});
*/

/*2. Then modify like this*/

/* <<<OLD GET endpoint to retrieve all tasks from the database>>>

app.get('/', function(req, res) 
{
    const pool = openDb();

    pool.query('SELECT * FROM task', function(error,result){
        if(error)
        {
            res.status(500).json({error: error.message});
        }
        res.status(200).json(result.rows);
    });
});
*/

// <<<<<<<<   NEW GET endpoint to retrieve all tasks from the database   >>>>>>>>>

// This route handler is now using the new 'query' function from the db.js module
todoRouter.get('/', async (req, res) => 
{
  try 
  {
      // The 'query' function is used instead of the 'pool.query' directly.
      // It simplifies error handling by allowing the use of try/catch with async/await.
        
        // The 'ASC' keyword specifies an ascending order.
      const result = await query('SELECT * FROM task ORDER BY id ASC');

      // Send the retrieved rows as JSON. If no rows are found, an empty array is returned.
      res.status(200).json(result.rows);
  } 
  catch (error) 
  {
      // Errors from the 'query' function are caught here and a 500 status code is sent back.
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});



/* <<<OLD POST endpoint to create a new task in the database>>>

// POST endpoint to create a new task in the database   (This Route Handler waits for POST requests at the URLpath/new)
app.post("/new", function(req, res)
{
    // Obtain a pool of database connections
    const pool = openDb();
  
    // The $1 placeholder will be replaced with 'req.body.description' value.
    // 'RETURNING *' will return all columns of the inserted row, including the auto-generated ID.
    pool.query(
      "INSERT INTO task (description) VALUES ($1) RETURNING *",
      [req.body.description], // Extracts the description from the request body
      (error, result) => { // Callback function to handle the query result
        if (error) 
        {
          // If an error occurs, send a 500 Internal Server Error status code and the error message
          res.status(500).json({ error: error.message });
        } 
        else 
        {
          // If successful, send a 200 OK status code and the inserted task's ID
          res.status(200).json({ id: result.rows[0].id });  //This retriev from the first row of the result which database automatically generated when the new task was inserted
        }
      }
    );
});
*/


// <<<<<<<<   NEW POST endpoint to create a new task in the database   >>>>>>>>>

// This handler is updated to use the new 'query' function
todoRouter.post("/new", async (req, res) => 
{
  try 
  {
      // The 'query' function is called with the SQL command and the values for the placeholders
      // Using 'async/await' simplifies the code structure, avoiding nested callbacks.
      const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', 
      [req.body.description]);
      // Respond with the new task's data
      res.status(200).json(result.rows[0]);
  } 
  catch (error) 
  {
      // Catch any errors and send back an appropriate response
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});




/* <<<OLD DELETE endpoint to remove an existing task from the database>>>

// DELETE endpoint to remove an existing task from the database (This Route Handler waits for DELETE requests at the URL path/delete/:id)
app.delete("/delete/:id", async(req, res) => 
{
  // Obtain a pool of database connections
  const pool = openDb();

  // Get the ID from the request parameters and convert it to an integer
  const id = parseInt(req.params.id);

  // Execute the delete query with the ID, $1 is a placeholder for the ID
  pool.query("DELETE FROM task WHERE id = $1", 
  [id], 
  (error, result) => {
      if (error) 
      {
          // If an error occurs, send a 500 Internal Server Error status code and the error message
          res.status(500).json({error: error.message});
      } 
      else 
      {
          // If successful, send a 200 OK status code and the deleted task's ID
          // Assuming the query results in a change, the ID is returned as confirmation of deletion
          res.status(200).json({id: id});
      }
  });
});

*/


// <<<<<<<<   NEW DELETE endpoint to remove an existing task from the database   >>>>>>>>>

// This handler now uses the new 'query' function and 'async/await' syntax for simplicity
todoRouter.delete("/delete/:id", async (req, res) => 
{
  try 
  {
      // Convert the id from the request parameters to a number
      const id = Number(req.params.id);
      // Await the result of the deletion query
      const result = await query('DELETE FROM task WHERE id = $1 RETURNING *', [id]);
      
      // If no rows were returned, the task did not exist, so return a 404 error      
      if (result.rowCount === 0) 
      {
          res.status(404).json({ message: 'Task not found' });
      } 
      else 
      {
          // Otherwise, return the id of the deleted task
          res.status(200).json({ id: result.rows[0].id });
      }
  } 
  catch (error) 
  {
      // Handle any errors during the query
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});




// <<<<<<<<   NEW PUT endpoint to update an existing task in the database   >>>>>>>>>
// This handler is updated to use the new 'query' function from the db.js module
todoRouter.put("/update/:id", async (req, res) => {
  try {    
    const id = parseInt(req.params.id);   // Extract the 'id' parameter from the URL and convert it to an integer
    
    const { description } = req.body;   // Extract the 'description' from the request body

    // Call the 'query' function with the SQL command to update the task
    // Passing the new description and the task id as parameters
    const result = await query(
      "UPDATE task SET description = $1 WHERE id = $2 RETURNING *",
      [description, id]
    );

    // If no rows were updated, then the task with the given id doesn't exist
    if (result.rowCount === 0) 
    {
      res.status(404).json({ message: 'Task not found' });
    } 
    else 
    {
      // Respond with the updated task's data
      res.status(200).json(result.rows[0]);
    }
  } 
  
  catch (error) {
    // Log the error to the console and respond with a 500 Internal Server Error status code
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});










// Export the router so it can be used in the main index.js
module.exports = todoRouter;