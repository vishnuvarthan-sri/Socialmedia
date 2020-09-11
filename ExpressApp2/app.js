var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var Swal = require('sweetalert2');
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
app.set('view engine', 'ejs',);
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ cookie: { maxAge: null } }))
app.use('/views', express.static(path.join(__dirname, '/views')));



app.get('/', function (req, res) {
    res.render('login', { message: req.flash('message') });
});
app.post('/login', function (req, res) {
    var uname = req.body.uname;
    var psw = req.body.psw;
    var email = req.body.email;

    Account.findOne({ uname: uname, psw: psw, email: email }, function (err, user) {
        if (!user) {
            req.flash('message', ' Wrong User!!');
            res.render('login', { message: req.flash('message') });
        }
        else {
            req.flash('message', 'saved sucessfully!');
            res.render('post-detail');
        }
        });
    
});
app.get('/signup', function (req, res) {
    res.render('signup', { message: req.flash('message') });
    
});
// sign up a new account handler
app.post('/signup', function (req, res) {
    // Insert the new user if they do not exist yet
    var uname = req.body.uname;
    var email = req.body.email;
    var psw = req.body.psw;
    var Cnpsw = req.body.Cnpsw;

         var user = new Account({
            uname:uname,
             email: email,
             psw: psw,
             Cnpsw: Cnpsw
         });
    user.save(function (err) {
        if (err) throw err;

        if (Cnpsw !== psw) {
            req.flash('message', 'wrong password!');
            res.render('signup');
        }
        else  {
            res.render('login', { message: req.flash('message') });
        }

    }); 
});

app.get('/password', function (req, res) {
    res.render('password', { isAdded: false});
}); 

app.post('/password', function (req, res) {
    var psw = req.body.psw;
    var Cnpsw = req.body.Cnpsw;
    var email = req.body.email;
   
        Account.findOne({ email: email }, function (err, user) {
            if (user) {

                if (Cnpsw !== psw) {
                    req.flash('message', 'wrong password!');
                    res.render('signup');
                }
                else {
                    Account.findOneAndUpdate({ psw: psw }, function (user) {
                        res.render('login', { message: req.flash('message') });
                    });
                }
            }
            else {
                    res.render('password', { isAdded: true });
                }
            

        });


});



app.get('/post-details', function (req, res) {
            res.render('post-detail'); 
});
app.post('/posts/detail/:id', function (req, res) {
   
    var post1 = new Post({
         
        post: req.body.post

    });
    post1.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully!');
    });
    
});

//logout request
    app.get('/logout', function (req, res) {
        res.render('login');
    });
