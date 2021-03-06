const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    pic: String,
    userType: String,
    socialid: String,
    provider: String,
    navId: String
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)