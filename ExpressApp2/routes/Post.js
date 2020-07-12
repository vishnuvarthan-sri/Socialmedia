var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var http = require("http");
var io = require("socket.io")(http);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');



var Posts = new  Schema({
    title: String,
    description: String,
    by: String,
    url: String
});

io.on('connection', function (socket) {
    socket.on('post', function (data){
        var postData = new Posts(data);
        postData.save();
        socket.broadcast.emit('post', data);
    });
});
var Post1 = mongoose.model('post', Posts)
module.exports = Post1;

