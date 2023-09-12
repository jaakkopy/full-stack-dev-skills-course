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
    creator: {
        type: mongoose.ObjectId,
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
    values = validateNewListData(newList, creator);
    const toAdd = ShoppingList({
        name: newList.name,
        date: values.date,
        creator: creator.id,
        group: values.groupId,
        items: []
    });
    await toAdd.save();
}

const ShoppingList = module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
module.exports.createList = createList;