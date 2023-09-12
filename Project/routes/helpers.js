const jwt = require('jsonwebtoken');

const successMsg = (msg) => {
    return {success: true, msg};
}

const failureMsg = (msg) => {
    return {success: false, msg};
}

const signJwtWithUserObject = (user) => {
    const signWith = {
        id: user._id,
        email: user.email,
        username: user.username,
        password: user.password
    };
    const token = jwt.sign(signWith, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRATION)
    });
    return {token, signWith};
}

const createJwtResponse = (token, user) => {
    const {password: _, ...userObjectWithoutPassword} = user;
    return {
        success: true,
        token: `JWT ${token}`,
        user: userObjectWithoutPassword
    };
}

module.exports = {successMsg, failureMsg, signJwtWithUserObject, createJwtResponse};