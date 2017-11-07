var db = require('../models/db').db
var medias = require('../models/medias');
var Medias = medias.Medias;
var archiver = require('archiver');
var fs = require('fs');
var wait = require('wait.for');
var thumbs = require('../config/config').thumbs
var proxys = require('../config/config').proxys
var srcs = require('../config/config').srcs

function mediasReadAll(res, role){
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
            res.status(200).json({medias:doc, role:role});
        }
    });
}

function mediasDownload(res, filenames){
    Medias.find({filename: {$in:filenames}}, (err, doc) => {
        var role = -1
        var msg;
        if(err){
            msg = {error: "Database Error: "+err, role:role};
            res.status(500).json(msg);
        }
        else if(doc === undefined){
            msg = {error: "No media available", role:role};
            res.status(500).json(msg);
        }
        else{
            res.status(200).json({medias:doc, role:role});
        }
    })
}

function deleteOne(res, id, role){
    Medias.remove({filename: id}, (err)=>{
        let msg;
        if(err){
            msg = {error: "Database Error: " + err, role:role};
            res.status(500).json(msg);
        }
        else{
            msg = {success: "Media deleted", role:role};
            if (fs.existsSync(thumbs+id+".png")){
                fs.unlinkSync(thumbs+id+".png");
            }
            if (fs.existsSync(proxys+id+".mp4")){
                fs.unlinkSync(proxys+id+".mp4");
            }
            if (fs.existsSync(srcs+id)){
                fs.unlinkSync(srcs+id);
            }
            res.status(200).json(msg);
        }
    })
}

module.exports = {
    mediasReadAll: mediasReadAll,
    mediasDownload: mediasDownload,
    deleteOne: deleteOne
};