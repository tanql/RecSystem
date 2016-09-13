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

var Photo = Backbone.Model.extend({

    parse: function (data) {
        if (data.taken) {
            data.dateFormatted = Moment(data.taken).calendar();
        }
        return data;
    },

    defaults: {
        name: '',
        garments: [],
        garment_count: function () {
            return this.garments.length;
        },
        store: 'Moods of Norway Hegdehaugsveien',
        taken: 0
    }
});

module.exports = Photo;
