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

const room = "COMMON_ROOM";


// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('User connected')

    socket.join(room);

    socket.on('GO_TO_GET_QUESTION', () => {
        fetch('http://bonddemo.tk/v1/question/request-question-node', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {

            setTimeout(function () {
                io.emit('BROADCAST_QUESTION_TO_CLIENT', response);
                setTimeout(function () {
                    console.log('time out')
                    io.emit('CLOSE_QUESTION');
                }, 12000)
            }, 0);
        
        })
        .catch(error => console.log(error));
    })

    socket.on("CLIENT_CHAT", (data) => {
		io.sockets.in(room).emit("SERVER_CHAT", data);
	})

    
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))