const path        = require('path')
var fs            = require('fs-extra');
var chokidar      = require('chokidar');
var temp_dir      = require('../config/config').temp_dir;
const { spawn, exec } = require('child_process');
var js2dir = require('../public/javascripts/json2HLdirectory');
var watcher = chokidar.watch(temp_dir, {ignored: /^\./, persistent: true});

watcher.on('all', function(path) {

    var timestamp = (new Date).getTime();
    var aLongTimeAgo = timestamp - 3600000;
    const isDirectory = source => fs.lstatSync(source).isDirectory()
    const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)
    for (var dirname in getDirectories){
        if (dirname < aLongTimeAgo){
            js2dir.clearDirectory(temp_dir+dirname);
        }
    }
});

module.exports = watcher;