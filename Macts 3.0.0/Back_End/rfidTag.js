const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 2727;

// Array to store received tag data
let tagDataArray = [];

app.use(bodyParser.urlencoded({ extended: true }));

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

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
