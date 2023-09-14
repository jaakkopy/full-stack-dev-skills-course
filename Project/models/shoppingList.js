const mongoose = require('mongoose');
const ValidationError = require('../errors/validationError');
const Group = require('./group');

const ShoppingListItemSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    price: {
        type: Number,
    },
    category: {
        type: String
    },
    comment: {
        type: String
    }
});

const ShoppingListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.ObjectId,
        required: true
    },
    items: [ShoppingListItemSchema]
});

const ShoppingListItem = mongoose.model('ShoppingListItem', ShoppingListItemSchema);
const ShoppingList = module.exports = mongoose.model('ShoppingList', ShoppingListSchema);

const validateNewListData = (newList, creator) => {
    if (!newList?.name || !newList?.date || !newList?.group)
        throw new ValidationError("name, date, and group should be defined and non-empty");
    // check that the creator is part of the group
    let groupId = null;
    for (let i = 0; i < creator.groups.length; ++i) {
        if (creator.groups[i].toString() === newList.group) {
            groupId = creator.groups[i];
            break;
        }
    }
    if (groupId == null)
        throw new ValidationError("Must be a member of the group to create a list for that group");
    const date = Date.parse(newList.date);
    if (isNaN(date))
        throw new ValidationError("Given date is not valid in the date time string format (e.g YYYY-MM-DD)");
    return {groupId, date}
}

const createList = async (newList, creator) => {
    const values = validateNewListData(newList, creator);
    const toAdd = ShoppingList({
        name: newList.name,
        date: values.date,
        creatorName: creator.username,
        group: values.groupId,
        items: []
    });
    await toAdd.save();
    return toAdd._id;
}

const getGroupsLists = async (user, groupIdString) => {
    const group = await Group.findOne({_id: new mongoose.Types.ObjectId(groupIdString)});
    if (group == null)
        throw new ValidationError("No group with that id exists");
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    const lists = await ShoppingList.find({ group: { $in:  group._id} });
    let toReturn = {name: group.name, lists: []};
    lists.forEach(l => {
        toReturn.lists.push({
            // return only the basic information about the list. Items will be fetched from a different route
            id: l._id,
            name: l.name,
            date: l.date,
            creatorName: l.creatorName
        });
    });
    return toReturn;
}

const getList = async (user, listId) => {
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listId)}); 
    if (list == null)
        throw ValidationError("No such list exists")
    if (user.groups.indexOf(list.group) === -1)
        throw ValidationError("Not a member of that group")
    return list
}

const getLists = async (user) => {
    const groups = user.groups;
    const lists = await ShoppingList.find({group: {$in: groups}});
    let toReturn = [];
    for (let i = 0; i < lists.length; ++i) {
        toReturn.push({
            id: lists[i]._id,
            groupName: await Group.findOne({_id: lists[i].group._id}).name,
            group: lists[i].group,
            name: lists[i].name,
            date: lists[i].date,
            creatorName: lists[i].creatorName,
        });
    }
    return toReturn;
}

const deleteList = async (user, listId) => {
    const list = await getList(user, listId);
    await ShoppingList.deleteOne({_id: list._id});
}

const getListById = async (user, listId) => {
    const list = await getList(user, listId);
    const toReturn = {
        id: list._id,
        creatorName: list.creatorName,
        name: list.name,
        date: list.date,
        items: list.items
    }
    return toReturn;
}

const validateNewItemData = (newItem) => {
    if (!newItem?.name || !newItem?.quantity)
        throw new ValidationError("name and quantity should be defined and non-empty");
}

const addToList = async (user, listId, newItemData) => {
    const list = await getList(user, listId);
    validateNewItemData(newItemData);
    const toAdd = ShoppingListItem({
        name: newItemData.name,
        quantity: newItemData.quantity,
        price: newItemData?.price,
        category: newItemData?.category,
        comment: newItemData?.comment
    });
    list.items.push(toAdd);
    await list.save();
    return toAdd._id;
}

const deleteItemFromList = async (user, listid, itemid) => {
    const list = await getList(user, listid);
    list.items = list.items.filter(i => i._id.toString() !== itemid);
    await list.save();
}

const updateListItem = async (user, listid, itemid, newValues) => {
    const list = await getList(user, listid);
    let item = list.items.find(i => i._id.toString() == itemid);
    if (item === -1)
        throw new ValidationError("No item with that id exists");
    if (newValues.name)
        item.name = newValues.name;
    if (newValues.quantity)
        item.quantity = newValues.quantity;
    if (newValues.price)
        item.price = newValues.price;
    if (newValues.category)
        item.category = newValues.category;
    if (newValues.comment)
        item.comment = newValues.comment;
    await list.save();
}

module.exports.createList = createList;
module.exports.deleteList = deleteList;
module.exports.getGroupsLists = getGroupsLists;
module.exports.getListById = getListById;
module.exports.addToList = addToList;
module.exports.deleteItemFromList = deleteItemFromList;
module.exports.updateListItem = updateListItem;
module.exports.getLists = getLists;