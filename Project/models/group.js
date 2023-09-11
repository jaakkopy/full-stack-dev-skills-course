const mongoose = require('mongoose');
const {hashPassword, comparePassword} = require('./authHelpers');

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


const Group = module.exports = mongoose.model('Group', Groupchema);