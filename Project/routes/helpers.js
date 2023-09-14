const jwt = require('jsonwebtoken');

const successResponse = (content) => {
    return {success: true, content};
}

const failureResponse = (content) => {
    return {success: false, content};
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

const handleError = (err, res) => {
    let status;
    let msg;
    if (err instanceof ValidationError) {
        status = 403;
        msg = err.message;
    } else {
        console.error(err.message);
        status = 500;
        msg = "Internal server error";
    }
    res.status(status).json(helpers.failureResponse(msg));
}

module.exports = {successResponse, failureResponse, signJwtWithUserObject, createJwtResponse, handleError};