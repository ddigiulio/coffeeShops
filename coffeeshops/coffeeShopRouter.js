const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var mongoose = require('mongoose');
const routerFunctions = require("../routerFunctions");
router.use(jsonParser);

const { coffeeShops } = require('./models');


router.get('/', (req, res) => {

  
      var coffeeShops = req.user.coffeeShops.map(coffeeshop => coffeeshop.apiRepr())
      res.json(coffeeShops);


});

router.post('/', jsonParser,
  (req, res) => {

    let user = req.user;
    let address = req.body.address;

    const requiredFields = ['name', 'address', 'rating'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    coffeeShops
      .create({
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        lat: req.body.lat || null,
        lng: req.body.lng || null,
        description: req.body.description,
        price: req.body.price
      })
      .then(
      function (coffeeshop) {
        user.coffeeShops.push(coffeeshop);
        user.save()
          .then(function (user) {
            res.status(201).json(coffeeshop.apiRepr());
          })
      });


  });

router.delete('/:id', (req, res) => {
  coffeeShops
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(coffeeshop => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/deleteAll', (req, res) => {
  coffeeShops.remove()
    .then(res.json({ message: "Deleted all" }))
})

//doesnt have to be this way:  might not need to have ID in body as long as ID is in endpoint?
//need to have a way to refer to which item I want to update and make sure that it is correct.
//can also manually add ID in body request upon update through API?

router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  // just so we dont update the wrong item 
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'address'];

  //eventually have a set of possible fields to update so make logic to check for that now
  //if changing schema make sure PUT reflects those changes
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  coffeeShops
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    //remember that $set is targeting attributes in the object where toUpdate represents all fields 
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .exec()
    .then(coffeeshop => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { router };
