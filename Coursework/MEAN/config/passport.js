const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); // extract the token from the authorization header
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.getUserById(jwtPayload._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));
}