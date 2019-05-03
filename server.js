'use strict';

// modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const Authenticator = require('./services/auth/authenticator');
const debug = require('debug')('factorioclone:*');

// routes module
const indexRouter = require('./routes/index');
const oreRouter = require('./routes/ore');

// objects
const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// use session
app.use(session({cookie: {maxAge: 1000 * 60 * 60 * 24}, secret: 'nsaeo4asenljans434lkj$#km', resave:false, saveUninitialized:false}));
// setting to passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

Authenticator.initialize(app);
Authenticator.setStrategy();

//routes
app.use('/', indexRouter);
app.use('/ore', oreRouter);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// events
io.on(
    'connection',
    (socket) => {
        // all chat events!
        // 1接続ごとの処理
        debug('connected');
        
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

module.exports = app;