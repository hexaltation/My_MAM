var nJwt = require('njwt');
var secureRandom = require('secure-random');
var secret = require('./config').secret;

var signingKey = secret; // Create a highly random byte array of 256 bytes

var claims = {
  iss: "http://localhost:3000/",  // The URL of your service
  sub: undefined,    // The UID of the user in your system
  scope: undefined
}

exports.jwt_generator = function(uid, role){
                            claims.sub  = uid;
                            claims.scope = role;
                            var jwt = nJwt.create(claims, signingKey);
                            return jwt.compact();}


exports.jwt_verify = function(token){
    nJwt.verify(token, signingKey, function(err, verifiedJwt){
      if(err){
        return false; // Token has expired, has been tampered with, etc
      }else{
        return verifiedJwt; // Will contain the header and body
      }
    });
}