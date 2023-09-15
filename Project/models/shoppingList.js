const mongoose = require('mongoose');

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
module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
module.exports.ShoppingListItem = ShoppingListItem;