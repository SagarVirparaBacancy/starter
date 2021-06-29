const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: String,
    displayName: String,
    routeName: String,
    icon: String,
    order: String,
    isSub: String,
    parent: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Navigation', UserSchema)