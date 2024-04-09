  const express = require('express');
  const app = express();
  // const config = require(path.resolve('./', 'config'));

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
    // database:'user_login',
    // multipleStatements: true
  });

  const server = app.listen(2525, function(){
    const host = server.address().address
    const port = server.address().port
    console.log("start");
  });

  con.connect(function(error){
    if(error) { 
      console.log(error);
    } else{
      console.log("connected");
    } 
  });

  app.get('/users', function(req, res){
    con.query('select * FROM user_login', function(error, rows, fields){
      if(error) {
        console.log('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
      } else {
        console.log('Data fetched successfully:', rows);
        res.json(rows);
      }
    });
  });
  