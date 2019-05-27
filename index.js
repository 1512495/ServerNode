const express = require('express');
const http = require('http');
const fetch = require('node-fetch');
const socketIO = require('socket.io');
const FormData = require('form-data');

// our localhost port
const port = 1235;
const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

const room = "COMMON_ROOM";
var arrayAnswer = [];
var right = 0;
var wrong = 0;

//get array answer of program
fetch('http://bonddemo.tk/v1/question/program-question', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
            'Content-Type': 'text/plain'
        },
    })
    .then(res => res.json())
    .then(response => {
        console.log(response);
        arrayAnswer = response;
    })
    .catch(error => console.log(error));


io.on('connection', socket => {
    console.log('User connected')

    socket.join(room);

    socket.on('GO_TO_GET_QUESTION', (program_id) => {
        fetch('http://bonddemo.tk/v1/question/render-question-program?sttQuestion='+program_id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {
            console.log(response);
            setTimeout(function () {
                io.emit('BROADCAST_QUESTION_TO_CLIENT', response);
                setTimeout(function () {
                    io.emit('CLOSE_QUESTION');
                }, 12000)
            }, 0);
        })
        .catch(error => console.log(error));
    })

    socket.on("CLIENT_CHAT", (data) => {
		io.sockets.in(room).emit("SERVER_CHAT", data);
    })
    

    socket.on('RESPONSE_ANSWER_TO_NODE', (program_id) => {
        var response = arrayAnswer[program_id - 1];
        right = 0;
        wrong = 0;
        io.emit("RESPONSE_ANSWER_TO_CLIENT", response);
    });

    
    socket.on("SUMMARY", (dataSum)=> {
        
        if(dataSum[1] === true) {
            right++;
        } else {
            wrong++;
        }
        socket.emit("MC_STATISTIC", [right, wrong]);
    });

    
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))