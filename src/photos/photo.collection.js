var Backbone = require('backbone');
var Photo = require('./photo.model');

var PhotoCollection = Backbone.Collection.extend({

    model: Photo,

    comparator: function (m1, m2) {
    var d1 = m1.get('taken');
    var d2 = m2.get('taken');
    if (d1 > d2) {
      return -1;
    }else if (d2 > d1) {
      return 1;
    }else {
      return 0;
    }
}

});

module.exports = PhotoCollection;
