var db = require('../models/db').db
var medias = require('../models/medias');
var Medias = medias.Medias;
var archiver = require('archiver');
var fs = require('fs');
var wait = require('wait.for');

function mediasReadAll(res){
    var output;
    Medias.find({}, function(err, doc){
        if(err){
            res.render('media', {title: "Test", medias: [], error: "An error occured"})
        }
        else if(doc == undefined){
            res.render('media', {title: "Test", medias: [], error: "No media available"})
        }
        else{
            res.render('media', {title: "Test", medias: doc})
        }
    });
}

function mediasDownload(res, body){

    // Setup response type
    

    var filenames = [];
    for(var key in body) filenames.push(key);
    var datetime = new Date();
    var zippedFilename = 'my_mam '+datetime+'.zip';
    res.type('application/zip');
    res.attachment(zippedFilename);
    var archive = archiver('zip', {zlib: { level: 1 }});

    archive.pipe(res);

    Medias.find({filename: {$in:filenames}}, function(err, doc){
        if(err){
            res.render('media', {title: "Test", medias: [], error: "An error occured during download"})
        }
        else if(doc == undefined){
            res.render('media', {title: "Test", medias: [], error: "No media available for download"})
        }
        else{
            //console.log(doc);
            for(var file in doc){
                //console.log(doc[file]);
                console.log(doc[file]['filename']);
                archive.append(fs.createReadStream('../my_MAM-src/FullRes/'+doc[file]['filename']), { name: doc[file]['originalname'] });
            }
            archive.finalize();
        }
    })
}

function finalize(archive, zippedFilename){
    console.log("Pouette")
    wait.forMethod(archive, "finalize");
    console.log("hop")
    console.log("toto")
}


module.exports = {
    mediasReadAll: mediasReadAll,
    mediasDownload: mediasDownload
};