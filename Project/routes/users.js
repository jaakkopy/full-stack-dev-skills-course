const Router = require('express').Router;
const User = require('../models/user.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        await User.registerUser(req.body);
        res.json(helpers.successMsg("user registered"));
    } catch (err) {
        let status;
        let msg;
        if (err instanceof TypeError) {
            status = 403;
            msg = err.message;
            res.status(200).json(helpers.failureMsg(err.message));
        // the duplicate key error is not a validator error: https://mongoosejs.com/docs/validation.html
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            status = 403;
            msg = "The username or email are already taken";
        } else {
            status = 500;
            msg = "Internal server error";
        }
        res.status(status).json(helpers.failureMsg(msg));
    }
});

module.exports = router;