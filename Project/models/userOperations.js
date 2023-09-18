const {hashPassword} = require('./authHelpers');
const ValidationError = require('../errors/validationError');
const User = require('./user');
const { default: mongoose } = require('mongoose');

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

const leaveGroup = async (user, groupId) => {
    const id = new mongoose.Types.ObjectId(groupId);
    user.groups = user.groups.filter(g => !g._id.equals(id));
    await user.save();
}

module.exports = {registerUser, getUserById, getUserByUsername, leaveGroup};