var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '../my_MAM-upload' }).single('myFile');
var db = require('../models/db').db
var medias = require('../models/medias');
var Media = medias.Medias;

/* GET home page. */
router.get('/', (req, res) => {
  res.render('ingest', {title: "Test"});
});

/* POST home page. */
router.post('/', (req, res) => {
    upload(req, res, () => {
    var file = req.file;
    if (file === undefined){
      res.render('index', {title: "Ingest"});
      return;
    }
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
                res.status(404).json(err);
                return;
            }
            else{
                res.render('ingest', {title: "file uploaded with success"});
                return;
            }
        });
  }) 
});

module.exports = router;
