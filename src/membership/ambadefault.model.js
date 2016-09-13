var Backbone = require('backbone');
var bigIcon = require('./ikoner/Bigicon.png');
var icon = require('./ikoner/Amba-ikon.png')
var AmbaModel = Backbone.Model.extend({

    defaults: {
        url : bigIcon,
        url1: icon,
        url2: icon,
        url3: icon,
        url4: icon,
        url5: icon,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus tristique libero sed suscipit. 200 poeng',
        achievments:[],
        amountOfTrophies: 0,
        points: 0
    }

});

module.exports = AmbaModel;
