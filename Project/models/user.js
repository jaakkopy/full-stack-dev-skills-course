const mongoose = require('mongoose');
const {hashPassword, comparePassword} = require('./authHelpers');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    groups: {
        type: [mongoose.ObjectId]
    }
});

const validateRegisterData = (userData) => {
    if (!userData?.username || !userData?.email || !userData?.password)
        return false;
    if (userData.length == 0 || userData.email.length == 0 || userData.password.length == 0)
        return false;
    return true;
}

const registerUser = async (userData) => {
    if (!validateRegisterData(userData))
        throw TypeError("Invalid user data");
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

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.registerUser = registerUser;
module.exports.getUserById = getUserById;
module.exports.getUserByUsername = getUserByUsername;
module.exports.comparePassword = comparePassword;