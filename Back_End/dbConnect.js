const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root123',
  database: 'project_rfid'
});

// const pool = mysql.createPool({
//   host: '192.168.140.36',
//   user: 'root',
//   port: '3306',
//   password: '',
//   database: 'project_rfid'
// });

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Main route to handle signup requests
app.post('/signup', (req, res) => {
  // Extract user data from the request body
  const { username, password } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Insert the user data into the database
    const sql = "INSERT INTO user_login (user_name, user_password) VALUES (?, ?)";
    connection.query(sql, [username, password], (error, result) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ error: 'Error signing up' });
      }

      // Send a success response
      res.status(200).json({ message: 'User signed up successfully' });
    });
  });
});

// Route to get all users
app.get('/users', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM user_login', (error, rows) => {
      // Release the connection
      connection.release();
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Error fetching data' });
      }
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint for student registration
app.post('/student_registration', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section, user_id, user_email } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO studentinfo (studentInfo_first_name, studentInfo_middle_name, studentInfo_last_name, studentInfo_tuptId, studentInfo_course, studentInfo_section, user_id, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section, user_id, user_email], (error, results) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'Student registered successfully' });
    });
  });
});

// API endpoint to fetch student information
app.get('/studentinfo/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('SELECT * FROM studentinfo WHERE user_id = ?', [userId], (error, rows) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error fetching student information:', error);
        return res.status(500).json({ error: 'Error fetching student information' });
      }
      // Send the fetched data
      res.json(rows);
    });
  });
});

// API endpoint for updating student information
app.post('/update_studentinfo/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const { firstName, middleName, lastName, user_email, tuptId, course, section } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }
    // Perform the database query to update the student information
    connection.query('UPDATE studentinfo SET studentInfo_first_name = ?, studentInfo_middle_name = ?, studentInfo_last_name = ?, user_email = ?, studentInfo_tuptId = ?, studentInfo_course = ?, studentInfo_section = ? WHERE user_id = ?', [firstName, middleName, lastName, user_email, tuptId, course, section, userId], (error, result) => {
      // Release the connection
      connection.release();

      if (error) {
        console.error('Error updating student information:', error);
        return res.status(500).json({ error: 'Error updating student information' });
      }
      // Send a success response
      res.json({ success: true, message: 'Student information updated successfully' });
    });
  });
});

// Array to store received tag data
let tagDataArray = [];

// Route to handle POST requests to /tagData
app.post('/tagData', (req, res) => {
  // Extract tag data from the request body
  const tagData = req.body.tagData;

  // Process the tag data (e.g., store it in an array)
  console.log('Received tag data:', tagData);
  tagDataArray.push(tagData);

  // Emit the tag data to all connected clients
  io.emit('tagData', tagData);

  // Send a response back to the Arduino
  res.send('Tag data received successfully');
});

// Check database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

// Start the server
const PORT = process.env.PORT || 2525;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});