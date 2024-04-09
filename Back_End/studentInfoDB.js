const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root123',
  database: 'project_rfid'
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API endpoint for student registration
app.post('studentInfo', (req, res) => {
  const { firstName, middleName, lastName, tuptId, course, section } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Perform the database query
    connection.query('INSERT INTO student_info (studentInfo_first_name, studentInfo_middle_name, studentInfo_last_name, studentInfo_tuptId, studentInfo_course, studentInfo_section) VALUES (?, ?, ?, ?, ?, ?)', [firstName, middleName, lastName, tuptId, course, section], (err, results) => {
      // Release the connection
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send a success response
      res.json({ success: true, message: 'Student registered successfully' });
    });
  });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
