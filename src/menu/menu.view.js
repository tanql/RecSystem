/**
 * Created by swinther on 04.07.2016.
 */
var Backbone = require('backbone');
require('./menu.view.scss');
var template = require('./menu.view.hbs');
var $ = require('jquery');

var user = require('../user.model');

var MenuView = Backbone.View.extend({
    el: '.menuhead',
    template: template,
    profileImage: '',

    initialize: function () {
      this.listenTo(user, 'profile:merged', this.render);
    },

    startMenu: function () {
        this.menuheadOpen = false;
        var view = this;
        this.mq = window.matchMedia('(min-width: 53em)');
        $('#content').click(function () {
            if (!view.mq.matches) {
                view.menuheadOpen = false;
                view.render();
            }
        });
        $(window).resize( function () {
            view.render();
        });
    },

    events: {
        'click #hamburger': 'onClick',
    },

    onClick: function () {
        this.menuheadOpen = !this.menuheadOpen;
        this.render();
    },

    renderMenuAndProfileImage: function () {
        this.render();
    },

    render: function () {
        var templateObject = {
            profileImage: this.profileImage
        };
        this.$el.html(this.template(templateObject));
        $('#landing').css('display','none');
        $('#login_overlay').css('display','none');
        if (this.mq.matches) { // ONE
            this.menuheadOpen = false;
            $('.menu').css('display', 'flex');
        } else if (!this.menuheadOpen) {
            return;
        } else {
            $('.menu').css('display', 'flex');
        }
        return this;
    }
});

module.exports = MenuView;
