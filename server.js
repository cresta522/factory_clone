'use strict';

// modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// objects
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// consts
const PORT = process.env.PORT || 7000;

// functions
const getNow = () => {
    const dt = new Date();
    return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
};

// events
io.on(
    'connection',
    (socket) => {
        console.log('connected');
        
        // disconnected event
        socket.on(
            'disconnect',
            () => {
                console.log('disconnected');
            }
        );
        
        // received new message
        socket.on(
            'new message',
            (message) => {
                console.log('new message is ' + message);
                
                const dtStr = getNow();
                
                const objMessage = {
                    message: message,
                    date: dtStr
                }
                
                // spread messages
                io.emit('spread message', objMessage);
            }
        );
    }
);

// -- events

// public dir
app.use(express.static(__dirname + '/public'));

// boot
server.listen(
    PORT,
    () => {
        console.log('Server on port %d', PORT);
    }
);