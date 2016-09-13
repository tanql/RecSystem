var Backbone = require('backbone');

var Garment = Backbone.Model.extend({
    defaults: {
        image: '',
        link: '',
        name: '',
        color: '',
        size: '',
        price: 0,
        sale_price: 0,
        details: ''
    },
    urlRoot: '/api/garments/'
});

module.exports = Garment;
