var express = require('express');
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





var app = express();
var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}));




app.engine('ejs', require('ejs').__express);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/views', express.static(path.join(__dirname, '/views')))





app.get('/', function (req, res) {
    res.redirect("/views/login.html");
});

app.post('/login', function (req, res) {
    var uname = req.body.uname;
    var psw = req.body.psw;
    var login = new Account({ uname, psw });
    console.log(login.uname);
         Account.find({ psw, uname},function (err, account) {
            if (err) return res.redirect("/views/signup.html", { message: "signup first" });
            else (account)
            res.render("post-detail", { message: "ready for post" });

        });
    

});

app.get('/signup', function (req, res) {
    res.redirect("/views/signup.html");
    
});

// sign up a new account handler
app.post('/signup', function (req, res) {
    var uname= req.body.uname;
    var email= req.body.email;
    var psw= req.body.psw;
    var account = new Account({ uname, email, psw });
    account.save(function (err) {
        if (err) return handleError(err);
    });

    Account.find({
        uname, email, psw
    }, function (error, account) {
        if (error) console.log("Error in adding User to Database");
        else (account)
        console.log("thank you for signing up");

    });

    Account.findOne({ uname }, function
        (err, account) {
        if (err) res.redirect("/views/signup.html", { messsage: "there is already an account" });
        else (account)
        req.session.account = account;
        req.session.save();
        res.redirect("/views/login.html");

    });

});



app.get('/post-details', function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('post-detail');
        }
    });
});



app.get('/posts/detail/:id', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var by = req.body.by;
    var post=req.body.post;
    var post1 = new Post({ title, description, by, post });
    console.log(post1.title);
    Post.find({
        title,
        description,
        by,
        post
    }, function (err, post) {
        if (err) {
            console.log(err);
        } else {

            res.render('post-detail');

        }
    });
});






//logout request
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/views/login.html");
})
