const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// GET QUERY PARAMS
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// JOIN CHATROOM
socket.emit('joinRoom', {username, room});

// GET ROOM AND USERS
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// MESSAGE
socket.on('message', message => {
    outputMessage(message);

    // SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// MESSAGE SUBMIT
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // USER MESSAGE
    const msg = e.target.elements.msg.value;

    // EMIT MESSAGE TO SERVER
    socket.emit('chatMessage', msg);

    // CLEAR INPUT
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// SEND MESSAGE TO DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// SEND ROOM NAME TO DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// SEND ROOM USERS TO DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
