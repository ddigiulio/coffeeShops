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


    const requiredFields = ['name', 'address'];
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
     
        user.coffeeShops = user.coffeeShops.concat([coffeeshop])
        user.save()
          .then(function (user) {
            res.status(201).json(coffeeshop.apiRepr());
          })
      });
      


  });

router.delete('/:name', (req, res) => {


  let user = req.user
  var index;
  user.coffeeShops.forEach((coffeeshop, i) => {
    if (coffeeshop.name === req.params.name) {
      index = i;
      return;
    }
  })

  user.coffeeShops.splice(index, 1)
  user.save().
    then(function (user) {
      res.json("successfully deleted")
    })


});


router.put('/:id', (req, res) => {
 

});

module.exports = { router };
