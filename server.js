const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');
const { Console } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// socket.emit(); = emit to the connecting client
// socket.broadcast.emit(); = emit to every client but the connecting client
// io.emit(); = emit to every client

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bot';

// CLIENT CONNECTION
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        // ADD USER TO ROOM
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // GREET THE NEW USER
        socket.emit('message', formatMessage(botName, 'Welcome aboard'));

        // BROADCAST USER CONNECTION
        socket
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        const aaa = user.room;

        // SEND ROOM USERS
        io.emit(
                'roomUsers',
                {room: user.room, users: getRoomUsers(user.room)}
            );
    });

    // CLIENT DISCONNECTION
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // SEND ROOM USERS
            io.emit(
                'roomUsers',
                {room: user.room, users: getRoomUsers(user.room)}
            );
        }

    });

    // LISTEN FOR chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username, msg));
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

