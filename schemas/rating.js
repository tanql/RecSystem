/**
 * Created by Tan on 03.09.2016.
 */
var mongoose = require('mongoose');

// set up a mongoose model
var RatingSchema = new mongoose.Schema({
    userID: {
        type: Number,
    },
    movieID: {
        type: Number
    },
    rating: {
        type: Number,
    }
});


module.exports = mongoose.model('Rating', RatingSchema);
