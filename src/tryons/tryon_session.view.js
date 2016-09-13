var Backbone = require('backbone');
var $ = require('jquery');
var Masonry = require('masonry-layout');

var tryonSessionTemplate = require('./tryon_session.hbs');
var GarmentModel = require('../photos/garment.model');
var GarmentView = require('../photos/garment.view');

var TryonSessionView = Backbone.View.extend({
    template: tryonSessionTemplate,
    tagName: 'div',
    className: 'tryon-date-view',
    garments_loaded: false,

    render: function () {
        var templateObject = this.model.toJSON();
        var htmlOutput = this.template(templateObject);
        this.$el.html(htmlOutput);
        this.addGarments()
            .done(function () {
                this.pokeMasonry();
            }.bind(this));

        return this;
    },
    renderAndFetchGarments: function () {
        this.render();
        return this.addGarments();
    },
    events: {
      'click .read-more' : 'pokeMasonry'
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
        this.garmentMasonry.layout();
        if (this.garments_loaded) {
        }
    }
});

module.exports = TryonSessionView;
