const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authSetting = require('../config/auth.json');

class Authenticator{
    static initialize(app){
        // initialize passport
        app.use(passport.initialize());
        
        //setting for management session
        app.use(passport.session());

        //encrypt(serialize) after log in
        passport.serializeUser((user, done) => {
            return done(null, user)
        });

        // deserialize
        // 毎回セッションに保存されたユーザ情報を復元する
        passport.deserializeUser((serializeUser, done) => {
            //DBから取得したりするけど、今回は何もしないです。
            return done(null, serializeUser);
        })
    }

    static setStrategy(){
        // passport.use: 設定
        // strategy: 認証種別
        // local strategy: ID PWのみの認証方法        

        passport.use(
            new LocalStrategy(
                {
                    usernameField: authSetting.usernameField,
                    passwordField: authSetting.passwordField,
                    passReqToCallback: true
                },
                ((req, username, password, done) => {
                    if(username == 'admin' && password == 'admin'){
                        //success
                        console.log('success!!');
                        //req.login();
                  
                        return done(null, username);
                    } else {
                        //failed..
                        req.flash('login_error', '失敗');
                        return done(null, false);
                    }
                })
            )
        )
    }

    static authenticate(req, res, next){
        passport.authenticate(authSetting.strategyName, {
            successRedirect: Authenticator.redirect.success,
            failureRedirect: Authenticator.redirect.failure,
            failureFlash: 'メールアドレスまたはパスワードに誤りがあります'
        })(req, res, next);
    }

    static isAuthenticated(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect(Authenticator.redirect.failure);
        }
    }
}

module.exports = Authenticator;

Authenticator.redirect = {
    success: '/',
    failure: '/login',
    permission: '/'
};