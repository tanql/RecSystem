var Backbone = require('backbone');
var template = require('./login.view.hbs');
var $ = require('jquery');
var _ = require('underscore');

var LoginView = Backbone.View.extend({
    el: '#login_overlay',
    template: template,
    router: '',
    model: '',

    events: {
        'submit #login-form': 'onLogin',
    },

    initialize: function (params) {
        this.router = params.router;
        this.model = require('../user.model');
    },
    render: function (options = {}) {
        const username = options.username || "";
        this.$el.html(this.template({username}));
        return this;
    },
    fetchAndRender: function () {
        this.render();
},
    onLogin: function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login/',
            type: 'POST',
            data: {
                'username': this.$('#username').val(),
                'password': this.$('#password').val()
            }})
            .fail((response) => {
                if (response.status === 400 || response.status === 403) {
                    this.router.navigate('denied', true);
                } else {
                    this.router.navigate('landing', true);
                }
            })
            .done((response) => {
                this.onLoginSuccess(response);
            });
    },
    onLoginSuccess: function (response) {
      this.$el.css('display','none');
      $('#landing').css('display','none');
      $('#content').css('display','block');
        this.model=response;
        sessionStorage.setItem('userId', response.userID);
      this.router.navigate('rate', true);
    }
});

module.exports = LoginView;
