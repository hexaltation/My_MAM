var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MediaSchema = mongoose.Schema({
    //_id: {type: ObjectId},
    filename: {type: String, unique: true},
    originalname: {type: String},
    mimetype: {type: String},
    encodingtype: {type: String},
    size: {type: Number},
    metadata: {type: String}
});

exports.Medias = mongoose.model('medias', MediaSchema);
