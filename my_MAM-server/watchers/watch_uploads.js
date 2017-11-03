var fs            = require('fs');
var chokidar      = require('chokidar');
var ffprobe       = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
var db = require('../models/db').db
var medias = require('../models/medias');
var Media = medias.Medias;
const { spawn, exec } = require('child_process');
var upload_dir    = require('../config/config').upload_dir;
var thumbs = require('../config/config').thumbs;
var proxys = require('../config/config').proxys;
var srcs = require('../config/config').srcs;
var logger = require('../logger/logger').logger;

var watcher = chokidar.watch(upload_dir, {ignored: /^\./, persistent: true});

var end_timeout = 30000;

watcher.on('add', function(path) {
    console.log(path);
    fs.stat(path, function (err, stat) {
        // Replace error checking with something appropriate for your app.
        if (err) throw err;
        setTimeout(checkEnd, end_timeout, path, stat);
    });
});

function ThumbAndProxyGenerate(err, doc, thumb_pos, filename, path){
    if(err){
        logger.log('error', err);
        fs.renameSync(path, srcs+filename);
    }
    else if(doc === undefined){
        logger.log('info', "No matching media to update");
        fs.unlink(path);
    }
    else{
        logger.log('info', "metadata inserted for ", filename);
        exec('ffmpeg -i '+path+' -vf "select=gte(n\\,'+thumb_pos+')" -vframes 1 '+thumbs+filename+'.png', (error, stdout, stderr) => {
        if (error) {
            logger.log('error', `exec error: ${error}`);
            return;
        }
        logger.log('info', `stdout: ${stdout}`);
        logger.log('error', `stderr: ${stderr}`);
        logger.log('info', "Thumbnail created");
        exec('ffmpeg -y -i '+path+' -c:v libx264 -preset veryfast -crf 0 -pix_fmt yuv420p -c:a aac -b:a 128k -strict -2 '+proxys+filename+'.mp4', (error, stdout, stderr) => {
            logger.log('info', `stdout: ${stdout}`)
            logger.log('error', `stderr: ${stderr}`);
            logger.log('info', "Proxy created");
            fs.renameSync(path, srcs+filename);
            })
        });
    }
}

function checkEnd(path, prev) {
    fs.stat(path, function (err, stat) {

        // Replace error checking with something appropriate for your app.
        if (err) throw err;
        if (stat.mtime.getTime() === prev.mtime.getTime()) {
            // Move on: call whatever needs to be called to process the file.
            var filename = path.split('/').slice(-1)[0];

            ffprobe(path, { path: ffprobeStatic.path }, function (err, info) {
                if (err){
                    logger.log('error', err);
                    fs.renameSync(path, srcs+filename);
                }
                else{
                
                    var infos = JSON.stringify(info);
                    var duration = info.streams[0].nb_frames
                    var thumb_pos = Math.floor((duration/10)+1);
                    Media.findOneAndUpdate({filename: filename},
                                                {$set: {metadata: infos}},
                                                {new: true},
                                                function(err, doc){
                                                    ThumbAndProxyGenerate(err, doc, thumb_pos, filename, path);
                                                });
                }
            });
        }
        else
            setTimeout(checkEnd, end_timeout, path, stat);
    });
}

module.exports = watcher;