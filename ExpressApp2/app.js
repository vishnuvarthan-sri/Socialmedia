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
app.use('/views', express.static(path.join(__dirname, '/views')));

app.get('/', function (req, res) {
    res.redirect("/views/login.html");
});
app.post('/login', function (req, res) {
    var uname = req.body.uname;
    var psw = req.body.psw;

    Account.findOne({ uname: uname, psw: psw }, function (err, user) {
        if (err) return res.redirect("/views/signup.html");
        if (!user) return res.send(401);
        res.render('post-detail'); 

    });
    
});
app.get('/signup', function (req, res) {
    res.redirect("/views/signup.html");
    
});
// sign up a new account handler
app.post('/signup', function (req, res) {
    // Insert the new user if they do not exist yet
    var uname = req.body.uname;
    var email = req.body.email;
    var psw = req.body.psw;

         var user = new Account({
            uname:uname,
             email: email,
             psw: psw 
         });
    user.save(function (err) {
        if (err) throw err;
        console.log('User saved successfully!');
    });

   res.redirect("/views/login.html");
    
});
app.get('/post-details', function (req, res) {
            res.render('post-detail'); 
});
app.post('/posts/detail/:id', function (req, res) {
   
    var post1 = new Post({
        
        description: req.body.description, 
        post: req.body.post

    });
    post1.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully!');
    });
    
});
//logout request
    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect("/views/login.html");
    });
