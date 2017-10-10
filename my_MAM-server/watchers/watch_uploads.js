var fs            = require('fs');
var chokidar      = require('chokidar');
var upload_dir    = require('../config/config').upload_dir;
var ffprobe       = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
var db = require('../models/db').db
var medias = require('../models/medias');
var Media = medias.medias;
const { spawn, exec } = require('child_process');
var thumbs = require('../config/config').thumbs;
var proxys = require('../config/config').proxys;
var srcs = require('../config/config').srcs;

var watcher = chokidar.watch(upload_dir, {ignored: /^\./, persistent: true});

var end_timeout = 30000;

watcher.on('add', function(path) {

    //console.log('File', path, 'has been added');

    fs.stat(path, function (err, stat) {
        // Replace error checking with something appropriate for your app.
        if (err) throw err;
        setTimeout(checkEnd, end_timeout, path, stat);
    });
});

function checkEnd(path, prev) {
    fs.stat(path, function (err, stat) {

        // Replace error checking with something appropriate for your app.
        if (err) throw err;
        if (stat.mtime.getTime() === prev.mtime.getTime()) {
            //console.log("upload finished");
            // Move on: call whatever needs to be called to process the file.
            var filename = path.split('/').slice(-1)[0];
            //console.log(filename);

            ffprobe(path, { path: ffprobeStatic.path }, function (err, info) {
                if (err){
                    //console.log(err);
                    fs.renameSync(path, srcs+filename);
                }
                else{
                
                    var infos = JSON.stringify(info);
                    var duration = info.streams[0].nb_frames
                    //console.log(info.streams[0].nb_frames);
                    var thumb_pos = Math.floor((duration/10)+1);
                    Media.findOneAndUpdate({filename: filename},
                                                {$set: {metadata: infos}},
                                                {new: true}, function(err, doc){
                        if(err){
                            //console.log(err);
                            fs.renameSync(path, srcs+filename);
                        }
                        else if(doc === undefined){
                            //console.log("No matching media to update");
                            fs.unlink(path);
                        }
                        else{
                            //console.log("metadata inserted for "+filename);
                            exec('ffmpeg -i '+path+' -vf "select=gte(n\\,'+thumb_pos+')" -vframes 1 '+thumbs+filename+'.png', (error, stdout, stderr) => {
                            if (error) {
                                //console.error(`exec error: ${error}`);
                                return;
                            }
                            //console.log(`stdout: ${stdout}`);
                            //console.log(`stderr: ${stderr}`);
                            //console.log("Thumbnail created")
                            exec('ffmpeg -i '+path+' -c:v libx264 -preset slow -crf 22 '+proxys+filename+'_prox.avi', (error, stdout, stderr) => {
                                //console.log(`stdout: ${stdout}`);
                                //console.log(`stderr: ${stderr}`);
                                //console.log("Proxy created");
                                fs.renameSync(path, srcs+filename);
                                })
                            });
                        }
                    });
                }
            });
        }
        else
            setTimeout(checkEnd, end_timeout, path, stat);
    });
}

module.exports = watcher;