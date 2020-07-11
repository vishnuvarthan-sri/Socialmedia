var express = require('express');
var debug = require('debug')('app4')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session');
mongoose.connect('mongodb+srv://vishnuvarthan:<thalavishnu98><vishnuvarthan>', { useMongoClient: true });
var Account = require('../routes/Account');
var Post = require('../routes/Post');
var Comments = require('../routes/coments');
var app = express();
var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})  


// view engine setup
app.engine('ejs', require('ejs').__express);
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'views')));

var authenticate = function (req, res, next) {
    if (req.session && req.session.user) return next();
    return res.redirect(__dirname + "/login.html");
} 


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// sign up a new account handler
app.post('/', function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.sendFile(__dirname + "/views/signup.html", { title: "signup", message: "Please Enter both username, password and email" });
    }
    //finding username from account database
    Account.findOne({ username: req.body.username }, function (error, account) {
        if (account) return res.sendFile(__dirname + "/views/signup.html", { title: "signup", message: "Username Already Exists" });
        else if (error) return console.log("error in accessing the database");
        // creating a new account
        else {
            Account.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }, function (error, account) {
                if (error) return console.log("Error in adding User to Database");
                else res.redirect('/');
            });
        }
    });
}); 

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.post('/', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.sendFile(__dirname + "/views/login.html", { title: "login", message: "Please Enter both username and password" });
    }

    Account.findOne({ username: req.body.username }, function (error, account) {
        if (error) return console.log("error in accessing the database");
        else if (!account) return res.sendFile(__dirname + "/views/login.html", { title: "login", message: "Username doesnot Exists" });
        if (account.compare(req.body.password)) {
            req.session.user = account;
            req.session.save();
            console.log("saved");
            console.log(req.session.user.username);
            console.log(req.session);
            res.redirect('/');
        }
        else return res.sendFile(__dirname + "/login.html", { title: "login", message: "Wrong password" });
    });

});

app.get('/', authenticate, function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.sendFile(__dirname + "/index.html", { posts: posts });
        }
    });
});


app.post('/posts/detail/:id', function (req, res) {
    Post.findById(req.params.id, function (err, postDetail) {
        if (err) {
            console.log(err);
        } else {
            Comments.find({ 'postId': req.params.id }, function (err, comments) {
                res.render('post-detail', { postDetail: postDetail, comments: comments, postId: req.params.id });
            });
        }
    });
}); 


//logout request
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/");
});


