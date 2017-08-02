const { coffeeShops } = require('./coffeeshops/models');

export const getCoffeeShops = function ()
{
    coffeeShops
    .find()
    .exec()
    .then(coffeeShops => {
      coffeeShops = coffeeShops.map(coffeeshop => coffeeshop.apiRepr())
      res.json(coffeeShops);
      
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' })
    });
}

