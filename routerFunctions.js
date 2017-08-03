const { coffeeShops } = require('./coffeeshops/models');

 function getCoffeeShops()
{
    coffeeShops
        .find()
        .exec()
        .then(coffeeShops => {
        coffeeShops = coffeeShops.map(coffeeshop => coffeeshop.apiRepr())
        return coffeeShops;    
        })
        .catch((err) => {
            if (err == 'user already exists') {
                throw new Error('User Already Exists');
            }
            if (err == 'some random error') {
                throw new Error('InternalServerError');
            }
});
}

module.exports = getCoffeeShops;

