var db = require('../models/db').db
var medias = require('../models/medias');
var Medias = medias.Medias;
var archiver = require('archiver');
var fs = require('fs');
var wait = require('wait.for');
var sourcepath = __dirname + '/../../my_MAM-src/FullRes';
var destpath = __dirname + '/../../my_MAM-temp';

function mediasReadAll(res){
    var msg;
    Medias.find({}, (err, doc) => {
        if(err){
            msg = {error: "An error occured"};
            res.status(500).json(msg);
        }
        else if(doc === undefined){
            msg = {error: "No media available"};
            res.status(500).json(msg);
        }
        else{
            res.status(200).json(doc);
        }
    });
}

function mediasDownload(res, filenames){
    Medias.find({filename: {$in:filenames}}, (err, doc) => {
        let msg;
        if(err){
            msg = {error: "Database Error: "+err};
            res.status(500).json(msg);
        }
        else if(doc === undefined){
            msg = {error: "No media available"};
            res.status(500).json(msg);
        }
        else{
            res.status(200).json(doc);
        }
    })
}

module.exports = {
    mediasReadAll: mediasReadAll,
    mediasDownload: mediasDownload
};