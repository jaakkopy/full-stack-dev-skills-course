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

// function copied from https://stackoverflow.com/questions/48799894/trying-to-hash-a-password-using-bcrypt-inside-an-async-function
async function hashPassword(givenPassword) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(givenPassword, saltRounds, (err, hash) => {
            if (err) 
                reject(err);
            resolve(hash);
        });
    })
    return hashedPassword
}

const registerUser = async (userData) => {
    if (!validateRegisterData(userData))
        throw TypeError("Invalid user data");
    userData.password = await hashPassword(userData.password);
    const toAdd = User(userData);
    await toAdd.save();
};

const getUserByUsername = async (username) => {
    const res = await User.findOne({ username: username });
    return res;
}

const getUserById = async (id) => {
    const user = await User.findById(id).exec();
    return user;
}

const comparePassword = async (password, hash) => {
    if (password == undefined || hash == undefined)
        return false;
    const match = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err)
                reject(err);
            resolve(isMatch);
        })
    });
    return match;
}

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.registerUser = registerUser;
module.exports.getUserById = getUserById;
module.exports.getUserByUsername = getUserByUsername;
module.exports.comparePassword = comparePassword;