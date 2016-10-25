
var Backbone = require('backbone');
var user = require('../user.model.js')

var RateModel = Backbone.Model.extend({

    url: '/api/recommend/?page=1',
    movies: [],
    previous:'',
    next:''

});

module.exports = RateModel;