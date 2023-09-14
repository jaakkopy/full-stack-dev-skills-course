const passport = require('passport');
const Router = require('express').Router;
const Group = require('../models/group.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const newGroupId = await Group.createGroup(req.user, req.body);
        res.status(200).json(helpers.successResponse(newGroupId));
    } catch (err) {
        if (err.message.indexOf('duplicate key error') !== -1) {
            res.status(403).json(helpers.failureResponse("That group name is already taken"))
        } else {
            helpers.handleError(err, res);
        }
    }
});

router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        await Group.deleteGroup(req.user, req.params.id);
        res.status(200).json(helpers.successResponse("Group deleted"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const groups = await Group.getUserGroupInfo(req.user);
        res.status(200).json(helpers.successResponse(groups));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

module.exports = router;