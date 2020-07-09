var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var http = require("http");
var io = require("socket.io")(http);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://vishnuvarthan:<thalavishnu98><vishnuvarthan>', { useMongoClient: true })

var Posts = new Schema({
    title: String,
    description: String,
    by: String,
    url: String
});
var Comments = new Schema({
    comment: String,
    postId: String
});
io.on('connection', function (socket) {
    socket.on('comment', function (data) {
        var commentData = new Comments(data);
        commentData.save();
        socket.broadcast.emit('comment', data);
    });

});
io.on('connection', function (socket){
    socket.on('post', function (data){
        var postData = new Posts(data);
        postData.save();
        socket.broadcast.emit('post', data);
    });
});

module.exports = mongoose.model('post', Posts);
module.exports = mongoose.model('Comments', Comments);
