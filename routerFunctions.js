const { coffeeShops } = require('./coffeeshops/models');

function getCoffeeShops() {
    return coffeeShops
        .find()
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
