const passport = require('passport');
const Router = require('express').Router;
const User = require('../models/user.js');
const Group = require('../models/group.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/create', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Group.createGroup(req.user, req.body);
        res.status(200).json(helpers.successMsg("New group created"));
    } catch (err) {
        let status;
        let msg;
        if (err instanceof TypeError) {
            status = 403;
            msg = err.message;
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            status = 403;
            msg = "That group name is already taken";
        } else {
            status = 500;
            msg = "Internal server error";
        }
        res.status(status).json(helpers.failureMsg(msg));
    }
});

module.exports = router;