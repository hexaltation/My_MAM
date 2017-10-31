var express = require('express');
var router = express.Router();
var multer = require('multer');
var ctrl_users = require('../controllers/ctrl_users');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('login');
});

/* POST Login. */
router.post('/', (req, res) => {
    ctrl_users.login(req, res);
});

module.exports = router;