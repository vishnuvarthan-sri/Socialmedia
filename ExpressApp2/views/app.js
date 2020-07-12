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
mongoose.connect('mongodb+srv://vishnuvarthan<Thala@vishnu98><vishnuvarthan>', { useMongoClient: true });
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
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/views', express.static(path.join(__dirname, '/views')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/signup.html"));
});

// sign up a new account handler
app.post('/', function (req, res) {
    Account.create({
        uname: req.body.uname,
        password: req.body.password,
        email: req.body.email
    }, function (error, account) {
            if (error) return console.log("Error in adding User to Database");
            else if (Account, !req.body.uname || !req.body.password || !req.body.email) {
            return res.sendFile(path.join(__dirname + "/signup.html", { title: "signup", message: "Please Enter username, password and email" }));
        }

        else (account)
            console.log("thank you for signing up");
    });
    Account.findOne({ uname: req.body.uname }, function
        (err, account) {
        if (err) res.redirect(path.join(__dirname+"/signup.html", { messsage: "there is already an account" }));
        else (account)
        res.redirect(window.location.pathname = '/login');

    });

});
    
  
 

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/login.html"));
});

app.post('/', function (req, res) {
    Account.create({ uname: req.body.uname, password: req.body.password }, function (err, account) {
        if (err) return res.redirect(window.location.href = '/signup.html', { message: "account already exist" });
        else if (Account.compare(req.body.password)) {
            req.session.user = account;
            req.session.save();
            console.log("saved");
            console.log(req.session.user.uname);
            console.log(req.session);
            res.render.redirect(window.location.pathname = '/posts/detail/:id');
        }
        else return res.sendFile(path.join(__dirname + "/login.html", { title: "login", message: "Wrong password" }));
    });

});

app.get('/',  function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.sendFile(path.join(__dirname + "/index.html", { posts: posts }));
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
    res.redirect(path.join(__dirname+"/views/login.html"));
});


