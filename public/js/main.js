const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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


// OUTPUT MESSAGE TO DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta">Sébastien <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
