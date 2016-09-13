/**
 * Created by ltanquac on 11.07.2016.
 */
var mongoose = require('mongoose');

var GarmentsSchema = new mongoose.Schema({
    image: String,
    link: String,
    name: String,
    color: String,
    size: String,
    price: Number,
    sale_price: Number,
    details: String,
    long_details: String


});



module.exports = mongoose.model('Garments', GarmentsSchema);
