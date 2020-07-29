var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var http = require("http");
var io = require("socket.io")(http);
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');

var Posts = new  Schema({  
    description: String,
    post: String,  
});
var db1 = mongoose.connection;
db1.once("open", () => {
    console.log("> successfully opened the database");
});


var Post = mongoose.model('Post', Posts);
module.exports = Post;


