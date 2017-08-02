const mongoose = require('mongoose');

const coffeeShopsSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  rating: {type: Number, required: true},
  photoURL: {type: String},
  description: {type: String},
  lat: {type: Number},
  lng: {type: Number},
  price: {type: Number}

});

coffeeShopsSchema.methods.apiRepr = function() {

  return {
    id:  this._id,
    name: this.name,
    address: this.address,
    rating: this.rating,
    lat: this.lat,
    lng: this.lng,
    description: this.description,
    price: this.price

  
  };
}

const coffeeShops = mongoose.model('coffeeShop', coffeeShopsSchema);

module.exports = {coffeeShops};
