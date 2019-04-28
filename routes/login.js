const express = require('express');
const router = express.Router();
const Authenticator = require('../services/auth/authenticator');

router.get('/', (req, res) => {
    const message = req.flash();
    res.render('/login', {
        message: message.error,
        title: 'ログイン'
    });
});

router.post('/', (req, res, next) => {
    Authenticator.authenticate(req, res, next);
});

module.exports = router;