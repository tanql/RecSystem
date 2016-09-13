/**
 * Created by ltanquac on 07.07.2016.
 */
var Backbone = require('backbone');

var ReceiptModel = Backbone.Model.extend({

    defaults: {
        store: 'Moods of Norway Hegdehaugsveien',
        taken: 'for 2 dager siden'
    }

});

module.exports = ReceiptModel;
