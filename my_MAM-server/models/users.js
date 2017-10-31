var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    role: {type: Number},
});

exports.Users = mongoose.model('users', UserSchema);
