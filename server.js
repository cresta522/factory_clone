'use strict';

// modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

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

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));


// login strategy
passport.use(
  'local',
  new LocalStrategy( ( username, password, done) => {
    // dbg: hard code
    console.log('username: ', username);
    console.log('password: ', password);
    if(username == 'admin' && password == 'admin'){
      //success
      console.log('success!!');
      //req.login();

      return done(null, username);
    } else {
      //failed..
      //req.flash('login_error', '失敗');
      console.log("login error");
      return done(null, false, {login_error: '失敗'});
    }
  })
);

/**
 * 
 * 設定順序これ大事…
 * 
 */

// use session
app.use(session({secret: 'nsaeo4asenljans434lkj$#km', resave:false, saveUninitialized:false}));

// setting to passport
app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  console.log('user', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
/*  User.findById(id, function(err, user) {
    done(err, user);
  });
*/
  console.log('deserializeUser');
  done(null, user);
});
// --use session

// routes
// あとでroutesは外だしする。

app.get('/', isAuthenticated, (req, res) => {
  console.log('isAuthenticated: ' + isAuthenticated);
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {  
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// default case 
app.use(express.static(__dirname + '/public'));

// auth function
function isAuthenticated(req, res, next){

  console.log('isAuthenticated: ' + req.isAuthenticated());
  if (req.isAuthenticated()) {  // 認証済
    return next();
  }
  else {  // 認証されていない
    res.redirect('/login');  // ログイン画面に遷移
  }
}

// boot
server.listen(
    PORT,
    () => {
        console.log('Server on port %d', PORT);
    }
);