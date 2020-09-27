const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// socket.emit(); = emit to the connecting client
// socket.broadcast.emit(); = emit to every client but the connecting client
// io.emit(); = emit to every client

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// CLIENT CONNECTION
io.on('connection', socket => {
    // GREET THE NEW USER
    socket.emit('message', 'Welcome aboard');

    // BROADCAST USER CONNECTION
    socket.broadcast.emit('message', 'A user has joined the chat');

    // CLIENT DISCONNECTION
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    // LISTEN FOR chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

