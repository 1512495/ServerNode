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
var current_id = "";
var current_answer = "";


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
            console.log(response);
            setTimeout(function () {
                io.emit('BROADCAST_QUESTION_TO_CLIENT', response);
                setTimeout(function () {
                    //TODO
                    io.emit('CLOSE_QUESTION');
                }, 12000)
                
            }, 0);
        
        })
        .catch(error => console.log(error));
    })

    socket.on("CLIENT_CHAT", (data) => {
		io.sockets.in(room).emit("SERVER_CHAT", data);
    })
    var listAnswer = [];

    socket.on("CHECK_ANSWER", (data) => {
		var answerClient = {
            email : data[0],
            answer: data[1],
            id : data[2],
        };
        listAnswer.push(answerClient);
		// var form = new FormData();
        // form.append('email', data[0]);
        // form.append('answer', data[1]);
        // form.append('id', data[2]);
        console.log(listAnswer);
        // current_id = data[2];
        // fetch('http://bonddemo.tk/v1/question/check-answer', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
        //     },
        //     body: form
        // })
        // .then(res => {
        //     res.json().then(response => {
        //         console.log(response);
        //         current_answer = response.answer;
        //     })
        // })
    })


    socket.on('RESPONSE_ANSWER_TO_NODE', () => {
        var res_data = [current_id, current_answer];
        io.emit("RESPONSE_ANSWER_TO_CLIENT", res_data);
    });


    socket.on("SUMMARY", (data)=> {
        console.log(data);
    })

    
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))