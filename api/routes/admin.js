const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Admin Page');
});

module.exports = router;