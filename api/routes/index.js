const express = require('express');
const router = express.Router();
const auth = require('../middleware/user_check');


router.get('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;