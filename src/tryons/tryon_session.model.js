var Backbone = require('backbone');
var Moment = require('moment');
Moment.locale('nb-my-settings', {
    parentLocale: 'nb',
    calendar : {
          lastDay : '[i går]',
          sameDay : '[i dag]',
          lastWeek : '[forrige] dddd',
          sameElse : 'D. MMMM YYYY'
      }
});

var TryonSession = Backbone.Model.extend({

    parse: function (data) {
        if (data.date) {
            data.dateFormatted = Moment(data.date).calendar();
        }
        return data;
    },

    defaults: {
        date: 0,
        store: 'Moods of Norway Hegdehaugsveien',
        garments: [],
        garment_count: function () {
            return this.garments.length;
        }
    }
});

module.exports = TryonSession;
