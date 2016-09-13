var Backbone = require('backbone');
var template = require('./login.view.hbs');
var $ = require('jquery');
var _ = require('underscore');
var fbLogin = require('../lib/fb-login');

var LoginView = Backbone.View.extend({

    el: '#login_overlay',
    template: template,
    router: '',
    model: '',

    events: {
        'submit #login-form': 'onLogin',
        'click #fb-login-button': 'onFbLogin',
        'click': 'onClick'
    },

    initialize: function (params) {
        this.router = params.router;
        this.model = require('../user.model');
    },

    onClick: function(e) {
        if (e.target.id === 'login_overlay') {
            this.$el.css('display','none');
            this.router.navigate('landing',true);
        }
    },

    onFbLogin: function (evt) {
      FB.login(() => {
        FB.getLoginStatus(response => {
          fbLogin.verifyFacebookLoginAndGetToken(response, (tokenResponse) => {
            this.onLoginSuccess(tokenResponse);
          });
        });
      });
      return false;
    },

    render: function (options = {}) {
        const username = options.username || "";
        this.$el.html(this.template({username}));
        fbLogin.initFacebookLogin('login_view');
        return this;
    },

    onLogin: function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/authenticate',
            type: 'POST',
            data: {
                'username': this.$('#username').val(),
                'password': this.$('#password').val()
            }})
            .fail((response) => {
                if (response.status === 401 || response.status === 403) {
                    this.router.navigate('denied', true);
                } else {
                    console.log(response.status);
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

      localStorage.setItem('x-access-token', response.token);
      sessionStorage.setItem('moods-userId', response._id);
      this.model.id = response._id;
      this.router.navigate('membership', true);
    }
});

module.exports = LoginView;
