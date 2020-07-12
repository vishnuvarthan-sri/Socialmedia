var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var http = require("http");
var io = require("socket.io")(http);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');
var Comments = this;
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
var Comments1 = mongoose.model('Comments', Comments)
module.exports = Comments1;