const mongoose = require('mongoose');

const coffeeShopsSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  rating: {type: Number, required: true},
  photoURL: {type: String},
  tags: {type: Array, required: true},
  description: {type: String},
  lat: {type: Number},
  lng: {type: Number}

});

coffeeShopsSchema.methods.apiRepr = function() {

  return {
    id:  this._id,
    name: this.name,
    address: this.address,
    rating: this.rating,
    tags: this.tags,
    photoURL: this.photoURL,
    lat: this.lat,
    lng: this.lng,
    description: this.description

    //for rating - check the format and make a virtual?
  
  };
}

const coffeeShops = mongoose.model('coffeeShop', coffeeShopsSchema);

module.exports = {coffeeShops};
