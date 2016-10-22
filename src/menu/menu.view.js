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

        // Close menu when anything outside the menu is clicked.
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

    /*
    Explanation to rendering function. There are three possibilities:
    ONE: Width of window is high: menu should be visible, but marked as closed
        in order to ensure that the menu is closed if the window is made more narrow
    TWO: Width of window is low: menu should should be invisible, it is already styled
        like this in CSS. WARNING: JS will overwrite.
    THREE: Width of window is low AND marked as open: menu should be visible.
    */
    render: function () {

        var templateObject = {
            profileImage: this.profileImage
        };

        this.$el.html(this.template(templateObject));
        // Removing landing page
        $('#landing').css('display','none');
        // Remove login overlay
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
