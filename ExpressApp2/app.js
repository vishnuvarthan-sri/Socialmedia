var express = require('express');
var debug = require('debug')('app4')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var window = require('window');
var mongo = require('mongodb');
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require('mongoose');
var session = require('express-session');
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');
var Account = require('./routes/Account');
var Post = require('./routes/Post');
var Comments = require('./routes/coments');

var app = express();
var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}));



// view engine setup
app.engine('ejs', require('ejs').__express);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/views', express.static(path.join(__dirname, '/views')))


    
  
 

app.get('/', function (req, res) {
    res.redirect ("/views/login.html");
});

app.post('/', function (req, res) {
    if (req.body && req.body.account) {
        Account.create({ uname: req.body.uname, psw: req.body.psw }, function (err, account) {
            if (err) return res.redirect("/views/signup.html", { message: "account does'nt exist signup first" });
            else (account)
            console.log("thank u for loggin in"); 
        });
        Account.findOne({ psw: req.body.psw, uname: req.body.uname }, function (err, account) {
            if (err) return res.redirect("/views/login.html", { message: "login again" });
            else (account)  
            res.redirect.render("/views/post-detail", { message: "ready for post" });
                
        });
    }

});

app.get('/', function (req, res) {
    res.redirect("/views/signup.html");
});

// sign up a new account handler
app.post('/', function (req, res) {
    if (req.body && req.body.account) {
        Account.create({
            uname: req.body.uname,
            psw: req.body.psw,
            email: req.body.email
        }, function (error, account) {
            if (error) console.log("Error in adding User to Database");
            else (account)
            console.log("thank you for signing up");

        });

        Account.findOne({ uname: req.body.uname }, function
            (err, account) {
            if (err) res.redirect("/views/signup.html", { messsage: "there is already an account" });
            else (account)
            req.session.account = account;
            req.session.save();
            res.redirect("/views/login.html");

        });

    }

});

app.get('/', function (req, res) {
               res.redirect.render("/views/post-detail.ejs", { posts: posts });       
});


app.post('/posts/detail/:id', function (req, res) {
    Post.findById(req.params.id, function (err, postDetail) {
        if (err) {
            console.log(err);
        } else {
            Comments.find({ 'postId': req.params.id }, function (err, comments) {
                res.render('/views/post-detail.ejs', { postDetail: postDetail, comments: comments, postId: req.params.id });
            });
        }
    });
    io.on('connection', function (socket) {
        socket.on('comment', function (data) {
            var commentData = new Comments(data);
            commentData.save();
            socket.broadcast.emit('comment', data);
        });
    });
});



//logout request
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/views/login.html");
});


