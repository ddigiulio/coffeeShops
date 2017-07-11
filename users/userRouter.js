const passport = require('passport');
const bodyParser = require('body-parser');
const express = require('express');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');
const { User } = require('./models');



const router = express.Router();

mongoose.Promise = global.Promise;


router.get('/', (req, res) => {
  return User
    .find()
    .exec()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server' })
    })
})

router.put('/', (req, res) => {

  var id = new mongoose.Types.ObjectId(req.user._id) 
  User
    .findByIdAndUpdate(
    id,
    { $push: { coffeeShops: req.body.coffeeshop}},
    { safe: true, upsert: true, new: true },
    function (err, record) {
      res.json({ record });
    });

});

router.post('/', (req, res) => {

  let { username, password, firstName, lastName } = req.body;//those 4 properties being picked out from req.body from AJAX request
  return User
    .find({ username })
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({ message: 'username already taken' });
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName
        });

    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' })
    });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.send(401, { success: false, message: 'authentication failed' });
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
 
      return res.send({ success: true, message: 'authentication succeeded' });
    });
  })(req, res, next);
});


router.get('/existing',
  // passport.authenticate('local'),
  function (req, res) {
    // passport.authenticate('local', function (err, user, info) {
      // debugger;
    // });
  });


router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      res.send(err);
    }
    res.json({ loggedout: true })
  });
})

router.delete('/deleteAll', (req, res) => {
  User
    .remove()
    .exec()
    .then(coffeeshop => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { router };