/**
 * Created by tanle on 04.11.2016.
 */

var Backbone = require('backbone');
var RatingsModel = require('./ratings.model.js')

var RatingsCollection = Backbone.Collection.extend({

    model: RatingsModel


});

module.exports = RatingsCollection;