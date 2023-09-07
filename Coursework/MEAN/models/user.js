const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = async (id) => {
    const user = await User.findById(id).exec();
    return user;
}

module.exports.getUserByUsername = async (username, callback) => {
    const query = {username: username};
    const res = await User.findOne(query);
    return res;
}

module.exports.addUser = async (newUser) => {
    const rounds = 10;
    bcrypt.genSalt(rounds, (err, salt) => {
        if (err)
            throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)
                throw err;
            newUser.password = hash;
            newUser.save();
        });
    }); 
}

module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, match) => {
        if (err)
            throw err;
        callback(null, match);
    });
}