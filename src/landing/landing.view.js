var Backbone = require('backbone');
require('./landing.view.scss');
var template = require('./landing.view.hbs');
var $ = require('jquery');
var _ = require('underscore');


var LandingView = Backbone.View.extend({

    el: '#landing',
    template: template,


    render: function () {

        this.$el.html(this.template());




    }

});

module.exports = LandingView;