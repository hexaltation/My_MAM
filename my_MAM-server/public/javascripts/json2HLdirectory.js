const fs = require('fs-extra');
var logger = require('../../logger/logger').logger;

function json2ids(obj){
    var ids = []
    for(var key in obj){
        if (obj[key].type === "folder"){
            ids = ids.concat(json2ids(obj[key]));
        }
        else if ((obj[key].type === "file")){
           ids.push(obj[key].id);
        }
    }
    return ids;
}

function json2HLdirectory(obj, destpath, sourcepath, assoc){
    var timestamp = (new Date).getTime();
    if (obj["type"] === "project"){
        destpath = destpath + "/" + timestamp;
        fs.mkdirSync(destpath, 0775);
    }
    for(var key in obj){
        if (obj[key].type === "folder"){
            var folderpath = destpath + "/" + obj[key].name;
            fs.mkdirSync(folderpath, 0775);
            json2HLdirectory(obj[key], folderpath, sourcepath, assoc);
        }
        else if ((obj[key].type === "file")){
            var sourcename = obj[key].id;
            var filename = assoc[sourcename];
            var filedestpath = destpath + "/" + filename;
            var filesourcepath = sourcepath + "/" + sourcename;
            fs.linkSync(filesourcepath, filedestpath);
        }
    }
    return destpath;
}

function clearDirectory(path){
    fs.remove(path, (err) => {
        if (err){
            logger.log('error', err);
        }
        else{
            logger.log("info", path, " removed with success");
        }
    });
}

module.exports = {
    json2ids: json2ids,
    json2HLdirectory: json2HLdirectory,
    clearDirectory: clearDirectory
};