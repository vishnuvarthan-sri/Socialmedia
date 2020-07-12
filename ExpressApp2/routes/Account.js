
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
mongoose.connect('mongodb+srv://vishnuvarthan:<Thala@vishnu98><vishnuvarthan>', { useMongoClient: true });
var account = "user";

// creating a new schema for account details
var accountSchema = new Schema({
    uname: { type: mongoose.SchemaTypes.String, required: true },
    email: { type: mongoose.SchemaTypes.String, required: true },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
        select: false
    }
});




// function called before the create function in post handler of signup
accountSchema.pre('save', function (next) {
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
var Account = mongoose.model('account', accountSchema)

module.exports = Account;
