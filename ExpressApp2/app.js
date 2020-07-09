var express = require('express');
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
var Account = require('./routes/Account');
var Post = require('./routes/Post');
var app = express();

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

// view engine setup
app.engine('ejs', require('ejs').__express);
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}));

var authenticate = function (req, res, next) {
    if (req.session && req.session.user) return next();
    return res.redirect('/login');
}





app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/signup.html'));
});

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.render('login', { title: "login", message: "Please Enter both username and password" });
    }

    Account.findOne({ username: req.body.username }, function (error, account) {
        if (error) return console.log("error in accessing the database");
        else if (!account) return res.render('login', { title: "login", message: "Username doesnot Exists" });
        if (account.compare(req.body.password)) {
            req.session.user = account;
            req.session.save();
            console.log("saved");
            console.log(req.session.user.username);
            console.log(req.session);
            res.redirect('/');
        }
        else return res.render('login', { title: "login", message: "Wrong password" });
    });
    
});


// sign up a new account handler
app.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.render('signup', { title: "signup", message: "Please Enter both username and password" });
    }
    //finding username from account database
    Account.findOne({ username: req.body.username }, function (error, account) {
        if (account) return res.render('signup', { title: "signup", message: "Username Already Exists" });
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
app.get('/index', authenticate, function (req, res) {
    posts.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('/index', { posts: posts });
        }
    });
});


app.get('/posts/detail/:id', function (req, res) {
    posts.findById(req.params.id, function (err, postDetail) {
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


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
