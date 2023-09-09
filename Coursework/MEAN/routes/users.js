const Router = require('express').Router;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

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

router.post('/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        // Check if the password matches the hash
        User.comparePassword(password, user.password, (err, match) => {
            if (err)
                throw err;
            if (match) {
                // Correct password. Create a JWT for the user
                const plainUserObject = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    password: user.password
                };
                const token = jwt.sign(plainUserObject, config.secret, {
                    expiresIn: 24 * 60 * 60 // day
                });
                // send the token
                const {password: _, ...userObjectWithoutPassword} = plainUserObject;
                res.json({
                    success: true,
                    token: `JWT ${token}`,
                    user: userObjectWithoutPassword
                });
            } else {
                res.json({success: false, msg: 'Incorrect credentials'});
            }
        });
    } catch (err) {
        res.json({success: false, msg: 'Failure'});
    }
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
    const toSend = {
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            username: req.user.username,
        }
    }
    res.json(toSend);
});

module.exports = router;