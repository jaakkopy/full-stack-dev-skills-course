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
    let belongsToGroup = false;
    for (let i = 0; i < creator.groups.length; ++i) {
        if (creator.groups[i].toString() === newList.group) {
            belongsToGroup = true;
            break;
        }
    }
    if (!belongsToGroup)
        throw new ValidationError("Must be a member of the group to create a list for that group");
}

const createList = (newList, creator) => {
    console.log(newList);
    console.log(creator);
    validateNewListData(newList, creator);
}

const ShoppingList = module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
module.exports.createList = createList;