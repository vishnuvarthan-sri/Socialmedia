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
})  


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
    res.redirect("/views/signup.html");
});

// sign up a new account handler
app.post('/', function (req, res) {
    Enter.create({
        uname: req.body.uname,
        password: req.body.password,
        email: req.body.email
    }, function (error, account) {
            if (error) return console.log("Error in adding User to Database");
            else (account)
            console.log("thank you for signing up");
            
    });
    Enter.findOne({ uname: req.body.uname }, function
        (err, account) {
        if (err) res.redirect("/views/signup.html", { messsage: "there is already an account" });
        else (account)
        respose.redirect("/views/login.html");

    });

});
    
  
 

app.get('/', function (req, res) {
    res.redirect ("/views/login.html");
});

app.post('/', function (req, res) {
    Enter.create({ uname: req.body.uname, password: req.body.password }, function (err, account) {
        if (err) return res.redirect( "/views/signup.html", { message: "account does'nt exist" });
        else if (Enter.compare(req.body.password)) {
            req.session.user = account;
            req.session.save();
            console.log("saved");
            console.log(req.session.user.uname);
            console.log(req.session);
            res.render.redirect( '/views/post-detail');
        }
        else return res.redirect("/views/login.html", { title: "login", message: "Wrong password" });
    });

});

app.get('/',  function (req, res) {
    Post1.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/views/index.html", { posts: posts });
        }
    });
});


app.post('/posts/detail/:id', function (req, res) {
    Post1.findById(req.params.id, function (err, postDetail) {
        if (err) {
            console.log(err);
        } else {
            Comments1.find({ 'postId': req.params.id }, function (err, comments) {
                res.render('post-detail', { postDetail: postDetail, comments: comments, postId: req.params.id });
            });
        }
    });
});


//logout request
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/views/login.html");
});


