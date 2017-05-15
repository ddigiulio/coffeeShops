const mongoose = require('mongoose');

const coffeeShopsSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  rating: {type: Number, required: true},
  photos: {type: Array, required: true},
  tags: {type: Array, required: true}

});

coffeeShopsSchema.methods.apiRepr = function() {

  return {
    id:  this._id,
    name: this.name,
    address: this.address,
    rating: this.rating,
    tags: this.tags
    //for rating - check the format and make a virtual?
  
  };
}

const coffeeShops = mongoose.model('coffeeShop', coffeeShopsSchema);

module.exports = {coffeeShops};
