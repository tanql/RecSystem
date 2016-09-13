var Backbone = require('backbone');
var TryonSession = require('./tryon_session.model');

var TryonSessionCollection = Backbone.Collection.extend({

    model: TryonSession,

    comparator: function (m1, m2) {
        var d1 = m1.get('date');
        var d2 = m2.get('date');
        if (d1 > d2) {
          return -1;
        }else if (d2 > d1) {
          return 1;
        }else {
          return 0;
        }
    }

});

module.exports = TryonSessionCollection;
