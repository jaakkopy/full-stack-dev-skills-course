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
        required: true
    },
    creatorId: {
        type: mongoose.ObjectId,
        required: true
    }
});

const Group = module.exports = mongoose.model('Group', Groupchema);

const validateNewGroupData = (newGroupData) => {
    if (!newGroupData?.name || !newGroupData?.password)
        throw new ValidationError("name and password should be defined and non-empty");
}

const createGroup = async (user, newGroupData) => {
    validateNewGroupData(newGroupData);
    newGroupData.password = await hashPassword(newGroupData.password);
    const toAdd = Group({creatorId: user._id, ...newGroupData});
    await toAdd.save();
    // add the creator as a member of the group
    user.groups.push(toAdd._id);
    await user.save();
    return toAdd._id;
}

const getUserGroupInfo = async (user) => {
    const groups = await Group.find({ _id: { $in: user.groups } });
    let toReturn = []
    groups.forEach(g => {
        toReturn.push({id: g._id, name: g.name});
    });
    return toReturn;
}

const deleteGroup = async (user, groupId) => {
    const group = await Group.findOne({_id: new mongoose.Types.ObjectId(groupId)});
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    if (!group.creatorId.equals(user._id))
        throw new ValidationError("Only the creator of the group can delete it");
    // remove users from the group
    const members = await User.find({groups: group._id});
    for (let i = 0; i < members.length; ++i) {
        members[i].groups = members[i].groups.filter(g => !g._id.equals(group._id));
        await members[i].save();
    }
    await Group.deleteOne({_id: group._id});
}

const joinGroup = async (user, joinData) => {
    const name = joinData.name;
    const givenPassword = joinData.name;
    const group = await Group.findOne({name: name});
    if (!group)
        throw new ValidationError("No group with that name exists");
    if (user.groups.find(g => g._id === group._id))
        throw new ValidationError("Already a member of that group");
    const actualHashedPassword = group.password;
    const isMatch = await comparePassword(givenPassword, actualHashedPassword);
    if (!isMatch)
        throw new ValidationError("Incorrect password");
    user.groups.push(group.id);
    await user.save();
    return group._id;
}

module.exports.createGroup = createGroup;
module.exports.getUserGroupInfo = getUserGroupInfo;
module.exports.deleteGroup = deleteGroup;
module.exports.joinGroup = joinGroup;