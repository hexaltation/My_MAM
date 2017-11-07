var express = require('express');
var router = express.Router();
var ctrl_medias = require('../controllers/ctrl_medias');
var ctrl_users = require('../controllers/ctrl_users');
var bodyParser = require('body-parser');
var nJwt = require('njwt');
var signingKey = require('../config/config').secret;


/* Get user page. */
router.get(['/', '/users'], (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            res.status(200).json({success:"Welcome Master"});
        }
    })
});

/* POST new user. */
router.post(['/', '/users'], (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            ctrl_users.register(req, res);
        }
    })
});

/* PUT user modifications. */
router.put(['/', '/users'], (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            res.status(200).json({msg:"put to /admin/"});
        }
    })
});

/* DELETE user. */
router.delete(['/', '/users'], (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            res.status(200).json({msg:"delete to /admin/"});
        }
    })
});

/* GET medias listing. */
router.get('/medias', (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            res.status(200).json({msg:"Welcome to /admin/medias"});
        }
    })
});

/* DELETE medias. */
router.delete('/medias', (req, res) => {
    var token = req.headers.authorization;

    nJwt.verify(token, signingKey, function(err, verifiedJwt){
        if(err){
            res.status(403).json({bad_token:err});
            // Token has expired, has been tampered with, etc
        }
        else if(verifiedJwt.body.scope !== 0){
            res.status(403).json({bad_token:"Must be admin"});
        }
        else{
            res.status(200).json({msg:"delete /admin/medias"});
        }
    })
})

module.exports = router;