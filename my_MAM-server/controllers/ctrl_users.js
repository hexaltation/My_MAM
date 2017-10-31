var db = require('../models/db').db
var users = require('../models/users');
var Users = users.Users;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

function login(req, res){
    var body = req.body;
    var email = body.email;
    var password = body.password;
    Users.findOne({'email': email}, (err, user) => {
        if (err){
            res.render('login', {alert: err});
        }
        else if (user === undefined){
            res.render('login', {alert: "No matching user or password"});
        }
        else if(bcrypt.compareSync(password, user.password)){
            //res.json("test");
            res.redirect('/media');
        }
        else{
            res.render('login', {alert: "No matching user or password"});
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
        res.render('admin', {alert: "invalid email, must be a valid mail"});
    }
    if (password !== password_confirm){
        res.render('admin', {alert: "password must match password_confirm"});
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
                res.render('admin', {alert: err})
            }
            else{
                res.render('admin', {alert: "user created"});
            }
        });
    }
    else{
        res.render('admin', {alert: "invalid request"});
    }
}

module.exports = {
    login: login,
    register: register
};