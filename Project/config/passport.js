const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); // extract the token from the authorization header
    opts.secretOrKey = process.env.JWT_SECRET; 
    passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.getUserById(jwtPayload.id);
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