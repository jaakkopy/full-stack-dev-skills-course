const Router = require('express').Router;
const User = require('../models/user.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        await User.registerUser(req.body);
        res.json(helpers.successMsg("user registered"));
    } catch (err) {
        if (err instanceof TypeError) {
            res.status(200).json(helpers.failureMsg(err.message));
        // the duplicate key error is not a validator error: https://mongoosejs.com/docs/validation.html
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            res.status(403).json(helpers.failureMsg("The username or email are already taken"));
        } else {
            res.status(500).json(helpers.failureMsg("Internal server error"));
        }
    }
});

module.exports = router;