require('./photos.scss');

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var PhotoCollection = require('./photo.collection');
var PhotoViewRoll = require('./photo.view.js');
var pageTemplate = require('./photos.hbs');

var headerImage = require('../../media/photos_header_image.png');

var PhotosModuleView = Backbone.View.extend({
    el: '#content',
    template: pageTemplate,
    photosToLoad: 2,

    initialize: function () {
        this.collection = new PhotoCollection;
    },
    fetchAndRender: function () {
        var user = require('../user.model');

        this.collection.url = '/api/photos/' + user.id ;

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
        this.addSome(this.photosToLoad);

        $(window).on('scroll', this.checkScroll.bind(this));

        return this;
    },
    events: {
        'click .load-more-button': 'addMore',
        'click .sharing-instructions-background': 'fadeOutSharingInstructions'
    },
    addOne: function (photo) {
        var view = new PhotoViewRoll({id: photo.cid, model: photo});
        this.$('#photo-container').append(view.render().el);
    },
    addSome: function (n) {
        var toBeAdded = this.collection.slice(this.added, this.added + n);
        _.each(toBeAdded, this.addOne, this);
        this.added += n;
        this.checkRemaining();
    },
    addMore: function () {
        this.addSome(this.photosToLoad);
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
    },
    fadeOutSharingInstructions: function () {
        $('.sharing-instructions-background').fadeOut(200);
    },
});

module.exports = PhotosModuleView;
