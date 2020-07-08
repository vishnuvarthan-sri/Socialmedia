var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
ObjectId = Schema.ObjectId;
var io = require("socket.io")(http);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://vishnuvarthan:<password>thalavishnu98<dbname>vishnuvarthan', { useMongoClient: true })
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));
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
