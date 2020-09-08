
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');


// creating a new schema for account details
var accountSchema = new Schema({
    uname: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            }
        }
    },
    psw: {
        type: String,
        required: true,
        
    },
    Cnpsw: {
        type: String,
        required: true,

    }
});

var db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});


var Account = mongoose.model('Account', accountSchema);
module.exports = Account;



