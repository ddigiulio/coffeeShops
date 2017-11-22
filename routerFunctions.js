const { coffeeShops } = require('./coffeeshops/models');

function getCoffeeShops(userCoffeeShops) {
    return coffeeShops
        .find({"address": {"$in": userCoffeeShops}})
        .exec()
        .then(coffeeShops => {
            return coffeeShops;
        });
        // .catch((err) => {
        //     console.log(err);
        //     throw new Error("SOME ERROR")
        // });
}

module.exports = {
    getCoffeeShops
}


  // coffeeShops
  //   .find({"address": {"$in": req.user.coffeeShops}})
  //   .exec()
  //   .then(coffeeShops => {
  //     coffeeShops = coffeeShops.map(coffeeshop => coffeeshop.apiRepr())
  //     res.json(coffeeShops);
  //   })
  //   .catch((err) => {
  //      res.status(500).json({ message: 'Internal server error' })
  //   });