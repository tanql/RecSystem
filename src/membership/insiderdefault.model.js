/**
 * Created by ltanquac on 14.07.2016.
 */
var Backbone = require('backbone');
var skjeggemannen = require('./ikoner/Insider-ikon.png');
var skjegg = require('./ikoner/skjeggemann_aw16.png')
var InsiderdefaultModel = Backbone.Model.extend({

    defaults: {
        url : skjegg,
        url1: skjeggemannen,
        url2: skjeggemannen,
        url3: skjeggemannen,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus tristique libero sed suscipit. 200 poeng',
        achievments:[],
        amountOfTrophies: 0,
        points: 0
    }

});

module.exports = InsiderdefaultModel;
