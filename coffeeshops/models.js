var mongoose = require('mongoose');

var coffeeShopsSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true, unique: true},
  rating: {type: Number},
  description: {type: String},
  price: {type: String}

},{ usePushEach: true });

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

const coffeeShops = mongoose.model('CoffeeShop', coffeeShopsSchema);

module.exports = {coffeeShops};
