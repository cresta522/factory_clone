const express = require('express');
const router = express.Router();
const Authenticator = require('../services/auth/authenticator');
const debug = require('debug')('factorioclone:*');
const authSetting = require('../services/config/auth.json');

// dashboard
router.get('/', Authenticator.isAuthenticated, (req, res) => {
    res.render('ore/index',{
        title: 'Faclone'
    });
});

router.get('/mining', Authenticator.isAuthenticated, (req, res) => {
    res.render('ores/mining',{
        title: 'Faclone'
    });
});

module.exports = router;