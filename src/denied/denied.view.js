var Backbone = require('backbone');
var template = require('./denied.view.hbs');
require('./denied.view.scss');
var $ = require('jquery');

var LoginErrorView = Backbone.View.extend({

    el: '#login_overlay',
    template: template,
    router: '',

    render: function (errorMessage = "Whooopsi") {
        this.$el.html(this.template({ErrorMessage: errorMessage}));
    }

});

module.exports = LoginErrorView;