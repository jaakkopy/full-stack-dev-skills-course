const mongoose = require('mongoose');
const User = require('./user');
const { hashPassword, comparePassword } = require('./authHelpers');
const ValidationError = require('../errors/validationError');
const ShoppingList = require('./shoppingList'); 
const Group = require('./group');

const validateNewGroupData = (newGroupData) => {
    if (!newGroupData?.name || !newGroupData?.password)
        throw new ValidationError("name and password should be defined and non-empty");
}

const createGroup = async (user, newGroupData) => {
    validateNewGroupData(newGroupData);
    newGroupData.password = await hashPassword(newGroupData.password);
    const session = await mongoose.startSession();
    const toAdd = Group({ creatorId: user._id, ...newGroupData });
    await mongoose.connection.transaction(async function executor(session) {
        await toAdd.save();
        // add the creator as a member of the group
        user.groups.push(toAdd._id);
        await user.save();
    });
    session.endSession();
    return toAdd._id;
}

const getUserGroupInfo = async (user) => {
    const groups = await Group.find({ _id: { $in: user.groups } });
    let toReturn = []
    groups.forEach(g => {
        toReturn.push({ id: g._id, name: g.name });
    });
    return toReturn;
}

const deleteGroup = async (user, groupId) => {
    const group = await Group.findOne({ _id: new mongoose.Types.ObjectId(groupId) });
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    if (!group.creatorId.equals(user._id))
        throw new ValidationError("Only the creator of the group can delete it");
    // The following should be atomic, so a transaction is used
    const session = await mongoose.startSession();
    await mongoose.connection.transaction(async function executor(session) {
        // remove users from the group
        const members = await User.find({ groups: group._id });
        for (let i = 0; i < members.length; ++i) {
            members[i].groups = members[i].groups.filter(g => !g._id.equals(group._id));
            await members[i].save();
        }
        // remove the shopping lists of the group
        await ShoppingList.deleteMany({group: group._id});
        // delete the group itself
        await Group.deleteOne({ _id: group._id });
    });
    session.endSession();
}

const joinGroup = async (user, joinData) => {
    const name = joinData.name;
    const givenPassword = joinData.name;
    const group = await Group.findOne({ name: name });
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

const getGroupById = async (user, groupId) => {
    const group = await Group.findOne({ _id: new mongoose.Types.ObjectId(groupId) });
    if (!group)
        throw new ValidationError("Group does not exist");
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    const creator = await User.findOne({ _id: group.creatorId });
    return {
        id: group._id,
        name: group.name,
        creatorName: creator.username
    }
}

const findGroupsByName = async (batchNum, pattern) => {
    if (isNaN(batchNum) || batchNum < 0)
        throw new ValidationError("Batch number must be an integer greater than 0");
    const batchSize = 50;
    const groups = await Group.find({"name" : { $regex: pattern, $options: 'i' }}).skip(batchNum * batchSize).limit(batchSize);
    let toReturn = [];
    groups.forEach(g => toReturn.push({name: g.name, id: g._id}));
    if (toReturn.length < 50) {
        return {groups: toReturn, lastBatch: true};
    }
    return {groups: toReturn, lastBatch: false};
}

module.exports = {createGroup, getUserGroupInfo, deleteGroup, joinGroup, getGroupById, findGroupsByName};