var express = require('express');
var router = express.Router();
var multer = require('multer');
var http = require('http');
var upload = multer({ dest: '../my_MAM-upload' }).single('myFile');
var logger = require('../logger/logger').logger;
var localStorageManager = require('local-storage-manager');
var cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    var options = {
        host: 'localhost',
        path: '/ingest',
        port: '3000',
        headers: {
            'authorization':token
        }
    };

    var request = http.get(options, function(response) {

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        response.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function() {
            var response_body = Buffer.concat(bodyChunks);
            var doc = JSON.parse(response_body);
            if (doc.bad_token){
                res.redirect('/');
            }
            else if (doc.error){
                res.render('ingest', {alert: doc.error});
            }
            else{
                res.render('ingest', {alert: ""});
            }
            // ...and/or process the entire body here.
        })
    });

    request.on('error', function(e) {
        logger.log('error', e.message);
    });
});

/* POST home page. */
router.post('/', (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    upload(req, res, () => {
        var file = req.file;
        if (file === undefined){
          res.render('ingest', {alert: "Requested Media is undefined"});
          return;
        }

        var datas = {
            filename :file.filename,
            originalname : file.originalname,
            mimetype : file.mimetype,
            encodingtype : file.encodingtype,
            size : file.size,
            metadata : "undefined",
        }

        var options = {
            host: 'localhost',
            port: '3000',
            path: '/ingest',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization':token
            }
        }
        var request = http.request(options, function(response) {

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                var response_body = Buffer.concat(bodyChunks);
                var doc = JSON.parse(response_body);
                if (doc.error){
                    res.render('ingest', {alert: doc.error});
                }
                else if (doc.success){
                    res.render('ingest', {alert: doc.success})
                }
                // ...and/or process the entire body here.
            })
        });

        request.on('error', function(e) {
            logger.log('error', e.message);
        });

        request.write(JSON.stringify(datas));

        request.end();
    }) 
});

module.exports = router;
