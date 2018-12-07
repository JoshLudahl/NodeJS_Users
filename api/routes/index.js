const express = require('express');
const router = express.Router();
const auth = require('../middleware/passport_authorize');
const passport = require('passport');

router.get('/', passport.authenticate('local', {
    // redirect back to /login
    // if login fails
    failureRedirect: '/login'
}), (req, res, next) => {
    res.render('index', { title: 'Welcome', message: 'Hello there! Thank you for visiting!!!' });
});

module.exports = router;