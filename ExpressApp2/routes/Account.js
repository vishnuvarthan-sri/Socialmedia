
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
mongoose.connect('mongodb+srv://vishnuvarthan:thalavishnu98@cluster0.6ngdn.mongodb.net/vishnuvarthan?retryWrites=true&w=majority');


// creating a new schema for account details
var accountSchema = new Schema({
    uname: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        type: String,
        required: true,
        select: false
    }
});




// function called before the create function in post handler of signup
accountSchema.pre('save', function (next) {
    var account = this;
    bcrypt.genSalt(10, function (error, salt) {
        bcrypt.hash(account.password, salt, function (e, hash) {
            account.password = hash;
            next();
        });
    });
});

// comparing if the password entered is correct
accountSchema.methods.compare = function (pw) {
    return bcrypt.compareSync(pw, this.password);
}
var db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

var Account = mongoose.model('account', accountSchema);
module.exports = Account


