const uuid = require('uuid')


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const coffeeShops = {
  create: function(name, description, location, whenFound) {
    const coffeeShop = {
      id: uuid.v4(),
      name: name,
      description: description,
      location: location,
      whenFound: whenFound || Date.now()
    };
    this.coffeeshops.push(coffeeShop);
    return coffeeShop;
  },
  get: function(id=null) {
   
    if (id !== null) {
      return this.coffeeshops.find(coffeeShop => coffeeShop.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    // return this.coffeeShops.sort(function(a, b) {
    //   return b.whenFound - a.whenFound
    // });
    return this.coffeeshops.sort(function (a,b) {
      return b.whenFound - a.whenFound;
    });
  },
  delete: function(id) {
    const coffeeShopIndex = this.coffeeshops.findIndex(
      coffeeShop => coffeeShop.id === id);
    if (coffeeShopIndex > -1) {
      this.coffeeShops.splice(coffeeShopIndex, 1);
    }
  },
  update: function(updatedCoffeeShop) {
    const {id} = updatedCoffeeShop;
    const coffeeShopIndex = this.coffeeshops.findIndex(
      coffeeShop=> coffeeShop.id === updatedCoffeeShop.id);
    if (coffeeShopIndex === -1) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.coffeeshops[coffeeShopIndex] = Object.assign(
      this.coffeeshops[coffeeShopIndex], updatedCoffeeShop);
    return this.coffeeshops[coffeeShopIndex];
  }
};

function createCoffeeShopsModel() {
  const storage = Object.create(coffeeShops);
  storage.coffeeshops = [];  //prototypinh
  return storage;
}


module.exports = {coffeeShops: createCoffeeShopsModel()};