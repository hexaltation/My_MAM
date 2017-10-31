var express = require('express');
var router = express.Router();
var ctrl_medias = require('../controllers/ctrl_medias');


/* GET medias listing. */
router.get('/', (req, res) => {
    ctrl_medias.mediasReadAll(res);
});

/* POST media downloads. */
router.post('/', (req, res) => {
    var body = req.body;
    var media_list = JSON.parse(unescape(body.json));
    ctrl_medias.mediasDownload(res, media_list);
});

module.exports = router;
