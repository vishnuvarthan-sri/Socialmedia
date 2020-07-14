
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');


// creating a new schema for account details
var accountSchema = new Schema({
    uname: { type: String, required: true },
    email: { type: String, required: true },
    psw: {
        type: String,
        required: true,
        select: false
    }
});


accountSchema.pre('save', function (next) {
    var account = this;
    bcrypt.genSalt(10, function (error, salt) {
        bcrypt.hash(account.psw, salt, function (e, hash) {
            account.psw = hash;
            next();
        });
    });
});

accountSchema.methods.compare = function (pw) {
    return bcrypt.compareSync(pw, this.psw);
}
var db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

var Account = mongoose.model('Account', accountSchema);
module.exports = Account;


