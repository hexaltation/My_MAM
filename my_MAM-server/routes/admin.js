var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.status(200).json({msg:"Welcome to /admin/"});
});

module.exports = router;