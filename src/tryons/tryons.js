require('./tryons.scss');

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var TryonSessionCollection = require('./tryon_session.collection');
var TryonSessionView = require('./tryon_session.view');
var pageTemplate = require('./tryons.hbs');

var headerImage = require('../../media/changing_room_header_image.png');

var PhotosModuleView = Backbone.View.extend({
    el: '#content',
    template: pageTemplate,
    sessionsToLoad: 2,

    initialize: function () {
        this.collection = new TryonSessionCollection;
    },
    fetchAndRender: function () {
        var user = require('../user.model');

        this.collection.url = '/api/tryons/' + user.id ;

        this.collection.fetch()
            .done(function () {
                this.render();
            }.bind(this));
    },
    render: function () {
        this.added = 0;

        var templateObject = {
            headerImage: headerImage,
            empty: this.collection.isEmpty()
        };

        var htmlOutput = pageTemplate(templateObject);
        this.$el.html(htmlOutput);
        this.addSome(this.sessionsToLoad);

        $(window).on('scroll', this.checkScroll.bind(this));

        return this;
    },
    events: {
        'click .load-more-button': 'addMore'
    },
    addOne: function (session) {
        var view = new TryonSessionView({id: session.cid, model: session});
        this.$('#tryons-container').append(view.render().el);
    },
    addSome: function (n) {
        var toBeAdded = this.collection.slice(this.added, this.added + n);
        _.each(toBeAdded, this.addOne, this);
        this.added += n;
        this.checkRemaining();
    },
    addMore: function () {
        this.addSome(this.sessionsToLoad);
    },
    addAll: function () {
        this.collection.each(this.addOne, this)
    },
    checkRemaining: function () {
        if (this.collection.size() <= this.added) {
            this.$('.load-more-button').remove();
        }
    },
    checkScroll: function () {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            this.addMore();
        }
    }
});

module.exports = PhotosModuleView;
