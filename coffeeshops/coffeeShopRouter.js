
const express = require('express');
const router = express.Router();


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const {coffeeShops} = require('./models');

router.get('/', (req, res) => {
  coffeeShops
    .find()
    .limit(10)
    .exec()
    .then(coffeeshops => {
      res.json({
        coffeeshops: coffeeshops.map(    
       (coffeeshop) => coffeeshop.apiRepr())
      });
    });
});

router.post('/', jsonParser, (req, res) => {
 
  const requiredFields = ['name', 'address'];
  for (let i=0; i<requiredFields.length; i++) {
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
    address: req.body.address
  })
  .then(
    coffeeshop => res.status(201).json(coffeeshop.apiRepr())
  )
});

router.delete('/:id', (req, res) => {
   coffeeShops
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(coffeeshop => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  // just so we dont update the wrong item 
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
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
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(coffeeshop=> res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};