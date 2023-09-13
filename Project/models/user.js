const mongoose = require('mongoose');
const {hashPassword, comparePassword} = require('./authHelpers');
const ValidationError = require('../errors/validationError');

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

const User = module.exports = mongoose.model('User', UserSchema);

const validateRegisterData = (userData) => {
    if (!userData?.username || !userData?.email || !userData?.password)
        throw new ValidationError("username, email, and password should be defined and non-empty");
}

const registerUser = async (userData) => {
    validateRegisterData(userData);
    userData.password = await hashPassword(userData.password);
    const toAdd = User(userData);
    await toAdd.save();
};

const getUserByUsername = async (username) => {
    const res = await User.findOne({ username: username });
    return res;
}

const getUserById = async (id) => {
    const user = await User.findById(id).exec();
    return user;
}

module.exports.registerUser = registerUser;
module.exports.getUserById = getUserById;
module.exports.getUserByUsername = getUserByUsername;
module.exports.comparePassword = comparePassword;