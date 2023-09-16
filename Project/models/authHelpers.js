const bcrypt = require('bcryptjs');

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

module.exports = {hashPassword, comparePassword};