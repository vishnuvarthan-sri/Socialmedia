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
    post: String,
    postDetail: String,
    
});
var db1 = mongoose.connection;
db1.once("open", () => {
    console.log("> successfully opened the database");
});


var Post = mongoose.model('Post', Posts);
module.exports = Post;


