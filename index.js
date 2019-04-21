const express = require('express');
const http = require('http');
const fetch = require('node-fetch');
const socketIO = require('socket.io');

// our localhost port
const port = 1235;
const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

var dataAPI = null;


fetch('http://bonddemo.tk/v1/question/render-question?difficulty=2',{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
            'Content-Type': 'text/plain'
        },
})
.then(res => res.json())
.then(response => {
    dataAPI = response;
    console.log(dataAPI);
})
.catch(error => console.log(error));


// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected')
  
  io.emit('BROADCAST_QUESTION_TO_CLIENT', dataAPI);

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))