const Router = require('express').Router;
const User = require('../models/user.js');
const helpers = require('./helpers.js');
const ValidationError = require('../errors/validationError');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        await User.registerUser(req.body);
        res.json(helpers.successMsg("user registered"));
    } catch (err) {
        let status;
        let msg;
        if (err instanceof ValidationError) {
            status = 403;
            msg = err.message;
        // the duplicate key error is not a validator error: https://mongoosejs.com/docs/validation.html
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            status = 403;
            msg = "The username or email are already taken";
        } else {
            console.error(err.message);
            status = 500;
            msg = "Internal server error";
        }
        res.status(status).json(helpers.failureMsg(msg));
    }
});

router.post('/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).json(helpers.failureMsg('User not found'));
        }
        const isMatch = await User.comparePassword(password, user.password);
        if (isMatch) {
            const {token, signWith} = helpers.signJwtWithUserObject(user);
            res.status(200).json(helpers.createJwtResponse(token, signWith));
        } else {
            res.status(403).json(helpers.failureMsg('Incorrect credentials'));
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json(helpers.failureMsg('Internal server error'));
    }
});

module.exports = router;