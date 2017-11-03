var express = require('express');
var router = express.Router();
var http = require('http');
var bodyParser = require('body-parser');
var localStorageManager = require('local-storage-manager');
var logger = require('../logger/logger').logger;
var cookieParser = require('cookie-parser');

/* GET users listing. */
router.get(['/', '/users'], (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    var options = {
        host: 'localhost',
        path: '/admin',
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
                res.render('admin', {alert: doc.error});
            }
            else{
                res.render('admin', {alert: ""});
            }
            // ...and/or process the entire body here.
        })
    });

    request.on('error', function(e) {
        logger.log('error', e.message);
    });
});

/* POST new user. */
router.post(['/', '/users'], (req, res) => {
    var token = req.cookies.token;
    if (token === undefined){
        res.redirect('/');
    }
    res.render('admin', {alert: ""});
    var body = req.body;

    var datas = {
        email : body.email,
        password : body.password,
        password_confirm : body.password_confirm,
        role: body.role
    }

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/admin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
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
            if (doc.bad_token){
                res.redirect('/');
            }
            else if (doc.error){
                res.render('admin', {alert: doc.error});
            }
            else if (doc.success){
                //doc.token memorize in localstorage
                res.render('admin', {alert: doc.success});
            }
            // ...and/or process the entire body here.
        })
    });

    request.on('error', function(e) {
        logger.log('error', e.message);
    });

    request.write(JSON.stringify(datas));

    request.end();
});

module.exports = router;