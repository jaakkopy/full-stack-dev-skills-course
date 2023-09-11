const passport = require('passport');
const Router = require('express').Router;
const User = require('../models/user.js');
const Group = require('../models/group.js');
const helpers = require('./helpers.js');

const router = Router();

router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send("hello");
});

module.exports = router;