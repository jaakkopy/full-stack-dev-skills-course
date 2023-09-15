const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserOperations = require('../models/userOperations');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); // extract the token from the authorization header
    opts.secretOrKey = process.env.JWT_SECRET; 
    passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await UserOperations.getUserById(jwtPayload.id);
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