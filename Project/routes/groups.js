const passport = require('passport');
const Router = require('express').Router;
const GroupOperations = require('../models/groupOperations.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const newGroupId = await GroupOperations.createGroup(req.user, req.body);
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
        await GroupOperations.deleteGroup(req.user, req.params.id);
        res.status(200).json(helpers.successResponse("Group deleted"));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const group = await GroupOperations.getGroupById(req.user, req.params.id);
        res.status(200).json(helpers.successResponse(group));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const groups = await GroupOperations.getUserGroupInfo(req.user);
        res.status(200).json(helpers.successResponse(groups));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

router.post('/join', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const joinedGroupId = await GroupOperations.joinGroup(req.user, req.body);
        res.status(200).json(helpers.successResponse(joinedGroupId));
    } catch (err) {
        helpers.handleError(err, res);
    }
});

module.exports = router;