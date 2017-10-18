var express = require('express');
var router = express.Router();
var ctrl_medias = require('../controllers/ctrl_medias');


/* GET medias listing. */
router.get('/', function(req, res) {
    ctrl_medias.mediasReadAll(res);
});

/* POST media downloads. */
router.post('/', function(req, res) {
    body = req.body;
    console.log(body);
    //res.json(body);
    //res.download('../my_MAM-src/FullRes/a');
    ctrl_medias.mediasDownload(res, body);
});

module.exports = router;
