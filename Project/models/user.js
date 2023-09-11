const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    groups: {
        type: [mongoose.ObjectId]
    }
});

const User = module.exports = mongoose.model('User', UserSchema);