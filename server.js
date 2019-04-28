'use strict';

// modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

// routes module
const indexRouter = require('./routes/index');

// objects
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// use session
app.use(session({secret: 'nsaeo4asenljans434lkj$#km', resave:false, saveUninitialized:false}));
// setting to passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
app.use('/', indexRouter);

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

module.exports = app;

// // login strategy
// passport.use(
//   'local',
//   new LocalStrategy( ( username, password, done) => {
//     // dbg: hard code
//     console.log('username: ', username);
//     console.log('password: ', password);
//     if(username == 'admin' && password == 'admin'){
//       //success
//       console.log('success!!');
//       //req.login();

//       return done(null, username);
//     } else {
//       //failed..
//       //req.flash('login_error', '失敗');
//       console.log("login error");
//       return done(null, false, {login_error: '失敗'});
//     }
//   })
// );

/**
 * 
 * 設定順序これ大事…
 * 
 */





// passport.serializeUser(function(user, done) {
//   console.log('serializeUser');
//   console.log('user', user);
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
// /*  User.findById(id, function(err, user) {
//     done(err, user);
//   });
// */
//   console.log('deserializeUser');
//   done(null, user);
// });
// // --use session

// // routes
// // あとでroutesは外だしする。

// app.get('/', isAuthenticated, (req, res) => {
//   console.log('isAuthenticated: ' + isAuthenticated);
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/login', (req, res) => {  
//   res.sendFile(__dirname + '/public/login.html');
// });

// app.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })
// );

// // default case 
// app.use(express.static(__dirname + '/public'));

// // auth function
// function isAuthenticated(req, res, next){

//   console.log('isAuthenticated: ' + req.isAuthenticated());
//   if (req.isAuthenticated()) {  // 認証済
//     return next();
//   }
//   else {  // 認証されていない
//     res.redirect('/login');  // ログイン画面に遷移
//   }
// }

// boot
// server.listen(
//     PORT,
//     () => {
//         console.log('Server on port %d', PORT);
//     }
// );