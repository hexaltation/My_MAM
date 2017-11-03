var db = require('../models/db').db
var users = require('../models/users');
var Users = users.Users;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var nJwt = require('njwt');
var signingKey = require('../config/config').secret;
var jwt_generator = require('../config/njwt').jwt_generator;

function login(req, res){
    var body = req.body;
    var email = body.email;
    var password = body.password;
    Users.findOne({'email': email}, (err, user) => {
        if (err){
            res.status(500).json({error: err});
        }
        else if (user === undefined){
            res.status(500).json({error: "No matching user or password"});
        }
        else if(bcrypt.compareSync(password, user.password)){
            token = jwt_generator(user._id, user.role);
            res.status(200).json({  status:200,
                                    msg: "user connected",
                                    token: token,
                                    user: { id: user._id,
                                            email: user.email,
                                            role: user.role }
                                    });
    }
        else{
            res.status(500).json({error: "No matching user or password"});
        }
    })    
}

function register(req, res){
    var body = req.body;
    var email = body.email;
    var password = body.password;
    var password_confirm = body.password_confirm;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var check_mail = re.test(email);
    if (!check_mail){
        res.status(500).json({error: "invalid email, must be a valid mail"});
    }
    if (password !== password_confirm){
        res.status(500).json({error: "password must match password_confirm"});
    }
    else{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(body.password, salt);
        body.password = hash;
    }
    delete body.password_confirm;
    if (check_mail && hash){
        var user = new Users(body);
        user.save((err) => {  
            if (err) {
                res.status(500).json({error: err})
            }
            else{
                res.status(200).json({success: "user created"});
            }
        });
    }
    else{
        res.status(500).json({error: "invalid request"});
    }
}

module.exports = {
    login: login,
    register: register
};