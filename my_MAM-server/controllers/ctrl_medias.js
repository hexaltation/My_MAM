var db = require('../models/db').db
var medias = require('../models/medias');
var Medias = medias.Medias;
var archiver = require('archiver');
var fs = require('fs');
var wait = require('wait.for');
var js2dir = require('../public/javascripts/json2HLdirectory');
var sourcepath = __dirname + '/../../my_MAM-src/FullRes';
var destpath = __dirname + '/../../my_MAM-temp';

function mediasReadAll(res){
    Medias.find({}, (err, doc) => {
        if(err){
            res.render('media', {title: "Test", medias: [], error: "An error occured"})
        }
        else if(doc === undefined){
            res.render('media', {title: "Test", medias: [], error: "No media available"})
        }
        else{
            res.render('media', {title: "Test", medias: doc})
        }
    });
}

function mediasDownload(res, body){

    var counter = 0;
    var filenames = js2dir.json2ids(body);
    var datetime = new Date();
    var zippedFilename = 'my_mam '+datetime+'.tar';
    res.type('application/zip');
    res.attachment(zippedFilename);
    var archive = archiver('tar', {zlib: { level: 1 }});

    archive.pipe(res);

    Medias.find({filename: {$in:filenames}}, (err, doc) => {
        if(err){
            res.render('media', {title: "Test", medias: [], error: "An error occured during download"})
        }
        else if(doc === undefined){
            res.render('media', {title: "Test", medias: [], error: "No media available for download"})
        }
        else{
            var assoc={};
            for(var file in doc){
                var media = doc[file];
                if ('filename' in media && 'originalname' in media) {
                    assoc[doc[file].filename] = doc[file].originalname;
                }
            }
            var tempfolder = js2dir.json2HLdirectory(body, destpath, sourcepath, assoc);
            archive.directory(tempfolder, false);
            archive.finalize();
            archive.on('end', () => {
                counter += 1;
                js2dir.clearDirectory(tempfolder);
            })
        }
    })
}

module.exports = {
    mediasReadAll: mediasReadAll,
    mediasDownload: mediasDownload
};