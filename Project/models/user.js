const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    groups: {
        type: [mongoose.ObjectId]
    }
});

const validateRegisterData = (userData) => {
    if (!userData?.username || !userData?.email || !userData?.password)
        return false;
    if (userData.length == 0 || userData.email.length == 0 || userData.password.length == 0)
        return false;
    return true;
}

const hashPassword = (givenPassword) => {
    const rounds = 10;
    let hashedPassword;
    bcrypt.genSalt(rounds, (err, salt) => {
        if (err)
            throw err;
        bcrypt.hash(givenPassword, salt, (err, hash) => {
            if (err)
                throw err;
            hashedPassword = hash;
        });
    });
    return hashedPassword;
}

const registerUser = async (userData) => {
    if (!validateRegisterData(userData))
        throw TypeError("Invalid user data");
    userData.password = hashPassword(userData.password);
    const toAdd = User(userData);
    await toAdd.save();
};

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.registerUser = registerUser;