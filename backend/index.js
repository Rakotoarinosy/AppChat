const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const port = process.env.PORT || 5001;

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.get('/', (req,res) => {
    res.send('Hello World');
})

let userList = new Map();

io.on("connection", (socket) => {
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id);

    socket.broadcast.emit('user_list', [...userList.keys()]);
    socket.emit('user_List', [...userList.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    })

    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    });
});

function addUser (userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
}

function removeUser (userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}

http.listen(port, () => {
    console.log(`Server is runnig to : ${port}`)
});