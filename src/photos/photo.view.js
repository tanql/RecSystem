var Backbone = require('backbone');
var $ = require('jquery');
var Masonry = require('masonry-layout');

var photoTemplateRoll = require('./photo.hbs');
var GarmentModel = require('./garment.model');
var GarmentView = require('./garment.view');

var PhotoViewRoll = Backbone.View.extend({
    template: photoTemplateRoll,
    tagName: 'div',
    className: 'photo-view',
    garments_loaded: false,

    render: function () {
        var templateObject = this.model.toJSON();
        var htmlOutput = this.template(templateObject);
        this.$el.html(htmlOutput);

        return this;
    },
    renderAndFetchGarments: function () {
        this.render();
        return this.addGarments();
    },
    events: {
        'click .actions': 'stopPropagation',
        'click .photo-controls-bar' : 'toggleGarments',
        'click .share-button': 'fadeInSharingInstructions',
        'click .fullscreen-button' : 'toggleFullscreen',
        'click .next-button' : 'scrollToNext',
        'click .prev-button' : 'scrollToPrev',
        'click .read-more' : 'pokeMasonry'

    },
    stopPropagation: function (event) {
        event.stopPropagation();
    },
    toggleGarments: function () {
        if (this.model.toJSON().garment_count() > 0) {
            this.$('.garments-container-outer').slideToggle(250);
            this.$('.show-garments').fadeToggle(250);
            this.$('.hide-garments').fadeToggle(250);
            this.$('.arrow').toggleClass('flip');
            this.$('.arrow').toggleClass('flip-back');
            if (!this.garments_loaded) {
                this.garments_loaded = true;
                this.addGarments()
                    .done(function () {
                        this.$('.loader').remove();
                        this.pokeMasonry();
                    }.bind(this));
            } else {
                this.pokeMasonry();
            }
        }
    },
    fadeInSharingInstructions: function () {
        $('.sharing-instructions-background').fadeIn(200).css("display","flex");
    },
    toggleFullscreen: function () {
        $('#photos-page').toggleClass('fullscreen');
        $('.menuhead').toggleClass('stay');
        $('.fullscreen-button').toggleClass('hidden');
        $('html, body').animate({
            scrollTop: this.$('.photo-and-details').offset().top
        }, 0);
        this.pokeMasonry();
    },
    scrollToNext: function () {
        var next = this.$el.next();
        if ( next.length ) {
            $('html, body').animate({
                scrollTop: this.$el.next().find('.photo-and-details').offset().top
            }, 200);
        } else {
            $('html, body').animate({
                scrollTop: '+=30px'
            }, 150);
            $('html, body').animate({
                scrollTop: '-=30px'
            }, 150);
        }
    },
    scrollToPrev: function () {
        var prev = this.$el.prev();
        if ( prev.length ) {
            $('html, body').animate({
                scrollTop: this.$el.prev().find('.photo-and-details').offset().top
            }, 200);
        } else {
            $('html, body').animate({
                scrollTop: '-=30px'
            }, 150);
            $('html, body').animate({
                scrollTop: '+=30px'
            }, 150);
        }
    },
    createGarmentCollection: function (garment_ids) {
        this.collection = new Backbone.Collection();
        garment_ids.forEach((garment_id) => {
            var garmentModel = new GarmentModel({id: garment_id});
            this.collection.add(garmentModel);
        })
    },
    renderGarment: function (garmentModel) {
        var view = new GarmentView({model: garmentModel});
        this.$('.garments-container').append(view.render().el);
    },
    addGarments: function () {
        var garment_ids = this.model.get('garments');

        this.createGarmentCollection(garment_ids);

        var fetchArray = this.collection.map(model => {
            return model.fetch();
        });
        return $.when(...fetchArray).done(() => {
            this.collection.forEach(model => this.renderGarment(model));
            this.garments_container = this.el.querySelector('.garments-container');
            this.garmentMasonry = new Masonry( this.garments_container, {
                itemSelector: '.garment-outer'
            });
            this.pokeMasonry();
        });
    },
    pokeMasonry: function () {
        if (this.garments_loaded) {
            this.garmentMasonry.layout();
        }
    }
});

module.exports = PhotoViewRoll;
