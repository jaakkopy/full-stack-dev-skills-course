const Router = require('express').Router;
const UserOperations = require('../models/userOperations.js');
const helpers = require('./helpers.js');
const authHelpers = require('../models/authHelpers.js');
const passport = require('passport');
const ValidationError = require('../errors/validationError');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        await UserOperations.registerUser(req.body);
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
        const user = await UserOperations.getUserByUsername(username);
        if (!user)
            throw new ValidationError('User not found')
        const isMatch = await authHelpers.comparePassword(password, user.password);
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

router.delete('/group/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await UserOperations.leaveGroup(req.user, req.params.id);
        res.status(200).json(helpers.successResponse("Left group"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});


module.exports = router;