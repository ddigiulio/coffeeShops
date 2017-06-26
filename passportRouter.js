const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./users/models');

function createPassportRouter() {
    router.use((req, res, next) => {
        debugger; 
        return next();
    });

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

    passport.serializeUser(function (user, done) {
        // debugger;
        done(null, user.id);
        //log in, send back to client
    });

    passport.deserializeUser(function (id, done) {
        // debugger;
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(localStrategy);
    router.use(passport.initialize());
    router.use(passport.session());



    return router;
}

module.exports = {
    createPassportRouter
};