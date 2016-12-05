/**
 * Created by tanle on 04.11.2016.
 */

var Backbone = require('backbone');


var RatingModel = Backbone.Model.extend({
    ratingValue: '',
    movie:'',
    user:''

});

module.exports = RatingModel;