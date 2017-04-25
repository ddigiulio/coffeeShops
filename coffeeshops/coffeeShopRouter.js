
const express = require('express');
const router = express.Router();


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

const {coffeeShops} = require('./models');

coffeeShops.create("Victrola Coffee Shop", "a nice open and busy shop", "near Starbucks Roastery");
coffeeShops.create('Analog Coffee Shop', "lowkey good music very open and friendly", "on Summit Ave");

router.get('/', (req, res) => {
  res.json(coffeeShops.get());
});


router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'description', 'location'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = coffeeShops.create(req.body.name, req.body.description, req.body.location);
  res.status(201).json(item);
});


// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
router.delete('/:id', (req, res) => {
  coffeeShops.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'description', 'location'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = coffeeShops.update({
    id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    location: req.body.location
  });
  res.status(204).json(updatedItem);
})

module.exports = {router};