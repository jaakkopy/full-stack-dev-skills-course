const mongoose = require('mongoose');
const ValidationError = require('../errors/validationError');

const ShoppingListSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: true
    },
    creatorName: {
        type: String,
        require: true
    },
    group: {
        type: mongoose.ObjectId,
        require: true
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
                type: String,
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
        throw new ValidationError("Given date is not valid in the date time string format");
    return {groupId, date}
}

const createList = async (newList, creator) => {
    const values = validateNewListData(newList, creator);
    const toAdd = ShoppingList({
        name: newList.name,
        date: values.date,
        creator: creator.username,
        group: values.groupId,
        items: []
    });
    await toAdd.save();
}

const getGroupsLists = async (groupData) => {
    const lists = await ShoppingList.find({ group: { $in: groupData.id } });
    let toReturn = [];
    lists.forEach(l => {
        toReturn.push({
            name: l.name,
            date: l.date,
            creatorName: l.creatorName,
            group: l.group,
            items: l.items
        });
    });
    return toReturn;
}

module.exports.createList = createList;
module.exports.getGroupsLists = getGroupsLists;