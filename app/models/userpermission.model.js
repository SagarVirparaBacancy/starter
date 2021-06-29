const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    navId: Array,
    navPermission: Array
}, {
    timestamps: true
})

module.exports = mongoose.model('UserPermission', UserSchema) 