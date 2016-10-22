
var Backbone = require('backbone');


var RateModel = Backbone.Model.extend({

    url: '/api/recommend/?page=1',
    movies: [],
    previous:'',
    next:''

});

module.exports = RateModel;