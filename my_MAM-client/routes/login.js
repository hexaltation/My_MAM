var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('../logger/logger').logger;
var localStorageManager = require('local-storage-manager');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('login', {alert: ""});
});

/* POST Login. */
router.post('/', (req, res) => {
    var body = req.body;

    var datas = {
            email : body.email,
            password : body.password
    }

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
                res.render('login', {alert: doc.error});
            }
            else if (doc.token){
                //doc.token memorize in localstorage
                res.cookie('token', doc.token, {maxAge:3600000});
                res.redirect('/media');
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

router.get('/logout', (req, res) => {
    //destruct token;
    res.cookie('token', "", {maxAge: -100000000000000000});
    res.cookie('project', "", {maxAge: -100000000000000000});
    res.redirect('/');
})

module.exports = router;