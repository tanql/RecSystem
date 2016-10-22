/**
 * Created by tanle on 07.10.2016.
 */
/**
 * Created by tanle on 23.09.2016.
 */

var Backbone = require('backbone');
var Movie = require('./rate.model')

var MoviesCollection = Backbone.Collection.extend({

    model: Movie

});

module.exports = MoviesCollection;