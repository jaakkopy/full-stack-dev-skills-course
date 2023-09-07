const Router = require('express').Router;
const User = require('../models/user');
const passport = require('passport-jwt');
const jwt = require('jsonwebtoken');

const router = Router();

router.post('/register', async (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    try {
        await User.addUser(newUser);
        res.json({success: true, msg: 'Registration successful'});
    } catch (err) {
        res.json({success: false, msg: 'Failed to register user'});
    }
    
});

module.exports = router;