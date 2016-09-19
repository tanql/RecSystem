var Backbone = require('backbone');
require('./landing.view.scss');
var template = require('./landing.view.hbs');
var $ = require('jquery');
var _ = require('underscore');


var LandingView = Backbone.View.extend({

    el: '#landing',
    template: template,

    initialize: function () {

        var view = this;
        this.model = require('../user.model');

        this.viewportHeight = $(window).height();
        this.videoHeight = $('#video').height();
        this.scrollOffset = $(document).scrollTop();
        this.mq = window.matchMedia('(min-width: 35em)');
        this.mq2 = window.matchMedia('(min-width: 65em)');
        this.$('#vidplayer').attr('muted', false);

        _.bindAll(this, 'onScroll');
        $(window).scroll(this.onScroll);

        this.$el.resize( function () {
            view.render();
        });
    },

    events: {
        'click': 'onClick'
    },

    onClick: function (e) {

        // Updating variables
        this.viewportHeight = $(window).height();
        this.videoHeight = $('#video').height();

        // The scroll length is the minimum of the video field and the viewport height
        var scrollLength = Math.min(this.viewportHeight, this.videoHeight);

        if (this.mq2.matches && e.target.id === 'show_benefits') {
            $(document.body).animate({
                'scrollTop': scrollLength
            },
                500
            );
        } else if (e.target.id === 'mutebtn') {
            if (this.$('#vidplayer').prop('muted')) {
                $('#mutebtn').attr('src',"public/icons/mute.svg");
            } else {
                $('#mutebtn').attr('src',"public/icons/speaker.svg");
            }
            this.$('#vidplayer').prop('muted', !this.$('#vidplayer').prop('muted'));
        }
    },

    onScroll: function () {

        this.viewportHeight = $(window).height();
        this.videoHeight = $('#video').height();
        this.scrollOffset = $(document).scrollTop();

        var opacityThreshold = Math.min(0.8 * this.viewportHeight, 0.8 * this.videoHeight);

        if (this.mq.matches) {
            this.$('#canvas').css('margin-top', ( - (this.scrollOffset * 0.02)) + 'em');
            if (this.scrollOffset <= 0.3 * opacityThreshold) {
                this.$('#video').css('opacity', 0.7);
                this.$('#canvas').css('opacity', 0);
            } else if ((this.scrollOffset / opacityThreshold) <= 1) {
                this.$('#video').css('opacity', (1 - this.scrollOffset / opacityThreshold));
                this.$('#canvas').css('opacity', (this.scrollOffset / opacityThreshold - 0.2));

            } else {
                this.$('#video').css('opacity', 0);
                this.$('#canvas').css('opacity', 1);
            }
        }
    },

    render: function () {
        this.model.url = "/api/users/";
        this.model.fetch().
            done(() => {
            console.log(this.model.toJSON())
            this.$el.html(this.template());
            this.$('#vidplayer').prop('muted', !this.mq.matches); // sound off on small device



    });

    }

});

module.exports = LandingView;