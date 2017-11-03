var express = require('express');
var router = express.Router();
var ctrl_medias = require('../controllers/ctrl_medias');
var nJwt = require('njwt');
var signingKey = require('../config/config').secret;

/* GET medias listing. */
router.get('/', (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
      if(err){
        res.status(403).json({bad_token: err})
        // Token has expired, has been tampered with, etc
      }else{
        ctrl_medias.mediasReadAll(res);
      }
    });
});

/* POST media downloads. */
router.post('/', (req, res) => {
    var body = req.body;
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
      if(err){
        res.status(403).json({bad_token:err})
        // Token has expired, has been tampered with, etc
      }else{
        ctrl_medias.mediasDownload(res, body);
      }
    });
});

module.exports = router;
