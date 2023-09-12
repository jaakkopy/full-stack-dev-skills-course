const mongoose = require('mongoose');
const User = require('./user');
const {hashPassword, comparePassword} = require('./authHelpers');
const ValidationError = require('../errors/validationError');

const Groupchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
});

const validateNewGroupData = (newGroupData) => {
    if (!newGroupData?.name || !newGroupData?.password)
        throw new ValidationError("name and password should be defined and non-empty");
}

const createGroup = async (creator, newGroupData) => {
    validateNewGroupData(newGroupData);
    newGroupData.password = await hashPassword(newGroupData.password);
    const toAdd = Group(newGroupData);
    await toAdd.save();
    // add the creator as a member of the group
    let user = await User.getUserById(creator.id);
    user.groups.push(toAdd._id);
    await user.save();
}

const Group = module.exports = mongoose.model('Group', Groupchema);
module.exports.createGroup = createGroup;