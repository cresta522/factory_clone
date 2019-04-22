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
const ADMIN_NAME = '**System**';

// functions
const getNow = () => {
    const dt = new Date();
    return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
};

// すべての接続で共通する変数等
let userCnt = 0;

// events
io.on(
    'connection',
    (socket) => {
        // all chat events!
        // 1接続ごとの処理
        
        console.log('connected');
        
        let user_name = '';
        
        // disconnected event
        socket.on(
            'disconnect',
            () => {
                console.log('disconnected');
                
                if(user_name && user_name.trim().length > 0){
                    userCnt--;
                    
                    const dtStr = getNow();
                    
                    const objMessage = {
                        user_name: ADMIN_NAME,
                        message: `${ADMIN_NAME} left. there are ${userCnt} participants`,
                        date: dtStr
                    }
                    
                    io.emit('spread message', objMessage);
                    io.emit('disconnected', user_name);
                }
            }
        );
        
        // received new message
        socket.on(
            'new message',
            (message) => {
                const dtStr = getNow();
                
                const objMessage = {
                    user_name: user_name,
                    message: message,
                    date: dtStr
                }
                
                // spread messages
                io.emit('spread message', objMessage);
            }
        );
        
        // log in
        socket.on(
            'join',
            (name) => {
                user_name = name;
                
                userCnt++;
                
                const dtStr = getNow();
                
                const objMessage = {
                    user_name: user_name,
                    message: `[info]${user_name} joined. there are ${userCnt} participants`,
                    date: dtStr
                }
                
                io.emit('spread joined', objMessage);
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