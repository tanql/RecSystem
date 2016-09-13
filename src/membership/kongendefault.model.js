/**
 * Created by ltanquac on 14.07.2016.
 */
var Backbone = require('backbone');
var bellboy = require('./ikoner/bellboy-bjarte.png');
var konge = require('./ikoner/Konge-ikon.png')

var KongedefaultModel = Backbone.Model.extend({

    defaults: {
        url:bellboy,
        url1: konge,
        url2: konge,
        url3: konge,
        url4: konge,
        url5: konge,
        url6: konge,
        url7: konge,
        url8: konge,
        url9: konge,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus tristique libero sed suscipit. 500 poeng',
        achievments:[],
        amountOfTrophies: 0,
        points: 0,
    }

});

module.exports = KongedefaultModel;