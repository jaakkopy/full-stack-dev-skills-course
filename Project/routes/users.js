const Router = require('express').Router;
const User = require('../models/user.js');
const helpers = require('./helpers.js');
const ValidationError = require('../errors/validationError');
const passport = require('passport');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        await User.registerUser(req.body);
        res.json(helpers.successResponse("user registered"));
    } catch (err) {
        if (err.message.indexOf('duplicate key error') !== -1) {
            res.status(403).json(helpers.failureResponse("The username or email are already taken"));
        } else {
            helpers.handleError(err, res);
        }
    }
});

router.post('/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.getUserByUsername(username);
        if (!user)
            throw new ValidationError('User not found')
        const isMatch = await User.comparePassword(password, user.password);
        if (isMatch) {
            const {token, signWith} = helpers.signJwtWithUserObject(user);
            res.status(200).json(helpers.createJwtResponse(token, signWith));
        } else {
            throw new ValidationError('Incorrect credentials')
        }
    } catch (err) {
        helpers.handleError(err, res);
    }
});


module.exports = router;