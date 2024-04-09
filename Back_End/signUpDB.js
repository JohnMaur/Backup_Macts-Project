const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

const con = mysql.createConnection({
  host:'localhost',
  user:'root',
  port: '3306',
  password:'root123',
  database:'project_rfid',
});

const server = app.listen(2527, function(){
  const host = server.address().address
  const port = server.address().port
  console.log("Server started on port:", port);
});

con.connect(function(error){
  if(error) { 
    console.log(error);
  } else {
    console.log("Connected to database");
  } 
});

// Route to handle signup requests
app.post('/signup', function(req, res){
  // Extract user data from the request body
  const { username, password, email} = req.body;

  // Insert the user data into the database
  const sql = "INSERT INTO user_login (user_name, user_password, user_email) VALUES (?, ?, ?)";
  con.query(sql, [username, password, email], function(error, result){
    if(error) {
      console.log('Error signing up:', error); // Log detailed error message
      res.status(500).json({ error: 'Error signing up' });
    } else {
      console.log('User signed up successfully');
      res.status(200).json({ message: 'User signed up successfully' });
    }
  });
});
