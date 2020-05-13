const mongoose = require("mongoose");
const shortid = require("shortid");
const userModel = mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        require: true,
        default: () => shortid.generate()
    },
    name: {
        type: String
    },
    alias: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    sessionId: {
        type: String,
        default: ""
    },
    sessionToken: {
        type: String,
        default: ""
    }
})

userModel.set('autoIndex');
const User = mongoose.model('User', userModel);
module.exports = User;
