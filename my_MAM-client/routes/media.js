var express = require('express');
var router = express.Router();
var http = require('http');
var archiver = require('archiver');
var fs = require('fs');
var wait = require('wait.for');
var js2dir = require('../public/javascripts/json2HLdirectory');
var sourcepath = __dirname + '/../../my_MAM-src/FullRes';
var destpath = __dirname + '/../../my_MAM-temp';
var logger = require('../logger/logger').logger;
var localStorageManager = require('local-storage-manager');
var cookieParser = require('cookie-parser');


/* GET medias listing. */
router.get('/', (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    var options = {
        host: 'localhost',
        path: '/media',
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
                res.render('media', {alert: doc.error, medias: {}});
            }
            else{
                res.render('media', {alert: "", medias: doc});
            }
            // ...and/or process the entire body here.
        })
    });

    request.on('error', function(e) {
        logger.log('error', e.message);
    });

});


/* POST media downloads. */
router.post('/', (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    var options = {
        host: 'localhost',
        port: '3000',
        path: '/media',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':token
        }
    }
    var body = req.body;
    var media_list = JSON.parse(unescape(body.json));
    var filenames = js2dir.json2ids(media_list);
    var counter = 0;
    var datetime = new Date();
    var zippedFilename = 'my_mam '+datetime+'.tar';


    var request = http.request(options, function(response) {

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
                res.render('media', {alert: doc.error, medias: ""});
            }
            else{
                res.type('application/zip');
                res.attachment(zippedFilename);
                var archive = archiver('tar', {zlib: { level: 1 }});
                archive.pipe(res);
                var assoc={};
                for(var file in doc){
                    var media = doc[file];
                    if ('filename' in media && 'originalname' in media) {
                        assoc[doc[file].filename] = doc[file].originalname;
                    }
                }
                var tempfolder = js2dir.json2HLdirectory(media_list, destpath, sourcepath, assoc);
                archive.directory(tempfolder, false);
                archive.finalize();
                archive.on('end', () => {
                    counter += 1;
                    js2dir.clearDirectory(tempfolder);
                })
            }
            // ...and/or process the entire body here.
        })
    });

    request.on('error', function(e) {
        logger.log('error', e.message);
    });

    request.write(JSON.stringify(filenames));

    request.end();
});

module.exports = router;
