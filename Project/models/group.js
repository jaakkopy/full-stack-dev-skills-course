const mongoose = require('mongoose');

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

module.exports = mongoose.model('Group', Groupchema);