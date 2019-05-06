const express = require('express');
const router = express.Router();
const Authenticator = require('../services/auth/authenticator');
const debug = require('debug')('factorioclone:*');
const authSetting = require('../services/config/auth.json');

router.get('/', Authenticator.isAuthenticated, (req, res) => {
    res.render('dashboard',{
        title: 'Faclone',
        loginUser: req.user
    });
});

router.get('/login', (req, res) => {
    
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        const message = req.flash();
        res.render('login', {
            message: message.error,
            title: 'Faclone',
            debugMode: authSetting.debugMode
        });
    }
});

router.post('/login', (req, res, next) => {
    debug(req.body);
    Authenticator.authenticate(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;