var Backbone = require('backbone');
var template = require('./register.view.hbs');
var $ = require('jquery');
var userModel = require('../user.model');

var LoginView = Backbone.View.extend({

    el: '#login_overlay',
    template: template,
    router: '',

    events: {
        'submit #register-form': 'onRegister'
    },

    initialize: function (params) {
        this.model = userModel;
        this.router = params.router;
    },

    onClick: function(e) {
        if (e.target.id === 'login_overlay') {
            this.$el.css('display','none');
            this.router.navigate('landing',true);
        }

    },

    render: function () {
        this.$el.html(this.template());
    },

    onRegister: function (e) {
        e.preventDefault();
        this.$el.css('display','none');
        $('#landing').css('display','none');
        $('#content').css('display','inherit');
        $.ajax({
            url: 'api/register/',
            type: 'POST',
            data: {
                'username': this.$('#username').val(),
                'password1': this.$('#password').val(),
                'password2': this.$('#password').val(),


            }})
            .done((response) => {
                this.model.id = response._id;
                this.router.navigate('landing', true);
            })
            .fail((response) => {

            })
    }
});

module.exports = LoginView;
