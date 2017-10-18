var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '../my_MAM-upload' }).single('myFile');
var db = require('../models/db').db
var medias = require('../models/medias');
var Media = medias.medias;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: "Test"});
});

/* POST home page. */
router.post('/', function(req, res){
  upload(req, res, function(){
    //console.log(req.body);
    //console.log(__dirname+'/');
    //console.log(req.file);
    var file = req.file;
    if (file === undefined){
      res.render('index', {title: "Test"});
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
        //console.log("New User :", user)
        media.save((err, createdMediaObject) => {  
            if (err) {
                res.status(404).json(err);
                return;
            }
            else{
                //console.log("media created in db:", createdMediaObject);
                res.render('index', {title: "file uploaded with success"});
                return;
            }
        });
  }) 
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.status(200).json({msg:"Welcome to /login"});
});

/* GET register page. */
router.get('/register', function(req, res) {
  res.status(200).json({msg:"Welcome to /register"});
});

module.exports = router;
