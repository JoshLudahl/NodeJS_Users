const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

        res.render('pages/admin/index');

});

module.exports = router;