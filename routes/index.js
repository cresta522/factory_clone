const express = require('express');
const router = express.Router();
const Authenticator = require('../services/auth/authenticator');

router.get('/', Authenticator.isAuthenticated, (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        const message = req.flash();
        res.render('login', {
            message: message.error,
            title: 'ログイン'
        });
    }
});

router.post('/login', (req, res, next) => {
    Authenticator.authenticate(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;