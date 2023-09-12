const passport = require('passport');
const Router = require('express').Router;
const Group = require('../models/group.js');
const helpers = require('./helpers.js');
const ValidationError = require('../errors/validationError');

const router = Router();

router.post('/create', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Group.createGroup(req.user, req.body);
        res.status(200).json(helpers.successResponse("New group created"));
    } catch (err) {
        let status;
        let msg;
        if (err instanceof ValidationError) {
            status = 403;
            msg = err.message;
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            status = 403;
            msg = "That group name is already taken";
        } else {
            console.error(err.message);
            status = 500;
            msg = "Internal server error";
        }
        res.status(status).json(helpers.failureResponse(msg));
    }
});

router.get('/usergroups', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const groups = await Group.getUserGroupInfo(req.user);
        res.status(200).json(helpers.successResponse(groups));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(helpers.failureResponse('Internal server error'));
    }
});

module.exports = router;