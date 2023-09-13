const mongoose = require('mongoose');
const ValidationError = require('../errors/validationError');

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
    items: [
        {
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
        }
    ]
});

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
}

const getGroupsLists = async (user, groupIdString) => {
    let groupId = null;
    for (let i = 0; i < user.groups.length; ++i) {
        if (user.groups[i].toString() === groupIdString) {
            groupId = user.groups[i];
            break;
        }
    }
    if (groupId == null) {
        throw new ValidationError("Not a member of that group");
    }
    const lists = await ShoppingList.find({ group: { $in:  groupId} });
    let toReturn = [];
    lists.forEach(l => {
        toReturn.push({
            // return only the ids and names of the lists. Additional information will be fetched from a different route
            id: l._id,
            name: l.name
        });
    });
    return toReturn;
}

const getListById = async (user, listId) => {
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listId)}); 
    if (list == null)
        throw ValidationError("No such group exists")
    if (user.groups.indexOf(list.group) === -1)
        throw ValidationError("Not a member of that group")
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
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listId)}); 
    if (user.groups.indexOf(list.group) === -1)
        throw new ValidationError("Not a member of that group")
    validateNewItemData(newItemData);
    const toAdd = {
        name: newItemData.name,
        quantity: newItemData.quantity,
        price: newItemData?.price,
        category: newItemData?.category,
        comment: newItemData?.comment
    }
    list.items.push(toAdd);
    await list.save();
}

const deleteItemFromList = async (user, listid, itemid) => {
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listid)}); 
    if (user.groups.indexOf(list.group) === -1)
        throw new ValidationError("Not a member of that group")
    list.items = list.items.filter(i => i._id.toString() !== itemid);
    list.save();
}

const updateListItem = async (user, listid, itemid, newValues) => {
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listid)}); 
    if (user.groups.indexOf(list.group) === -1)
        throw new ValidationError("Not a member of that group")
    let item = list.items.find(i => i._id.toString() == itemid);
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
    list.save();
}

module.exports.createList = createList;
module.exports.getGroupsLists = getGroupsLists;
module.exports.getListById = getListById;
module.exports.addToList = addToList;
module.exports.deleteItemFromList = deleteItemFromList;
module.exports.updateListItem = updateListItem;