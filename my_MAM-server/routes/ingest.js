var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require('body-parser');
var upload = multer({ dest: '../my_MAM-upload' }).single('myFile');
var db = require('../models/db').db
var medias = require('../models/medias');
var Media = medias.Medias;
var nJwt = require('njwt');
var signingKey = require('../config/config').secret;

/* GET ingest autorization */
router.get('/', (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err){
        if(err){
            res.status(403).json({bad_token: err})
            // Token has expired, has been tampered with, etc
        }else{
            res.status(200).json({success:"welcome"});
        }
    });
});

/* POST home page. */
router.post('/', (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err){
        if(err){
            res.status(403).json({bad_token:err})
            // Token has expired, has been tampered with, etc
        }
        else{
            var file = req.body;
            var filename = file.filename;
            var originalname = file.originalname;
            var mimetype = file.mimetype;
            var encodingtype = file.encodingtype;
            var size = file.size;
            var metadata = "undefined";

            var media = new Media({ filename: filename,
                                    originalname: originalname,
                                    mimetype: mimetype,
                                    encodingtype: encodingtype,
                                    size: size,
                                    metadata: metadata});

            media.save((err) => {  
                if (err) {
                    res.status(404).json({error: err});
                    return;
                }
                else{
                    res.json({success: "file uploaded with success"});
                    return;
                }
            });
        }
    });  
});

module.exports = router;