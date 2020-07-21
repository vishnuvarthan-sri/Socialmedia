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
    let user1 = Account.find({ uname: req.body.uname, psw: req.body.psw })
    if (user1) {
        res.render("post-detail", { message: "ready for post" });
    }
    else {
        res.redirect("/views/signup.html", { message:"signup first" });
        console.log(Account.uname);
    }
});

app.get('/signup', function (req, res) {
    res.redirect("/views/signup.html");
    
});

// sign up a new account handler
app.post('/signup', function (req, res) {
    let user = Account.find({ email: req.body.email, uname: req.body.uname, psw: req.body.psw });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new Account({
            uname: req.body.uname,
            email: req.body.email,
            psw: req.body.psw
        });
         user.save();
        console.log("thanku for sigining up")
        res.redirect("/views/login.html");
    }
});
    
       



var postdetail = {
    title:"",
    description: "",
    by: "",
    post: "",
}


app.get('/post-details', function (req, res) {
            res.render('post-detail'); 
});



app.get('/posts/detail/:id', function (req, res) {
   
    var post1 = new Post(postdetail)
   
    console.log(post1.title);
    post1.find({
        title: req.body.title,
        description: req.body.description,
        by: req.body.by,
        post: req.body.post
    }, function (err, post) {
        if (err) {
            console.log(err);
        } else(post) 

            res.render('post-detail');

        
    });
});






//logout request
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/views/login.html");
})
