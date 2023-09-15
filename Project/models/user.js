const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        type: [mongoose.ObjectId]
    }
});

module.exports = mongoose.model('User', UserSchema);