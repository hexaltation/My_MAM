var express = require('express');
var router = express.Router();
var ctrl_medias = require('../controllers/ctrl_medias');
var ctrl_users = require('../controllers/ctrl_users');
var bodyParser = require('body-parser');

/* GET users listing. */
router.get(['/', '/users'], (req, res) => {
    res.render('admin', {alert: ""});
});

/* POST new user. */
router.post(['/', '/users'], (req, res) => {
    ctrl_users.register(req, res);
});

/* PUT user modifiacations. */
router.put(['/', '/users'], (req, res) => {
    res.status(200).json({msg:"put to /admin/"});
});

/* DELETE user. */
router.delete(['/', '/users'], (req, res) => {
    res.status(200).json({msg:"delete to /admin/"});
});

/* GET medias listing. */
router.get('/medias', (req, res) => {
    res.status(200).json({msg:"Welcome to /admin/medias"});
});

router.post('/medias', (req, res) => {
    res.status(200).json({msg:"delete /admin/medias"});
})

module.exports = router;