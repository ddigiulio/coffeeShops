const router = express.Router();
// const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function createPassportRouter() {
    const localStrategy = new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            return done(null, user);
        });
    });

    passport.use(localStrategy);
    passport.serializeUser(function (user, done) {
        
        done(null, user.id);
        //log in, send back to client
    });

    passport.deserializeUser(function (id, done) {
       
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    router.use(passport.initialize());
    router.use(passport.session());
    return router;
}

module.exports = {
    createPassportRouter
};