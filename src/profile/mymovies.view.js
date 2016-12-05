var Backbone = require('backbone');
var $ = require('jquery');
var template = require('./mymovies.view.hbs');
require('./profile.scss');

var RatingsModel =  require('../rate/ratings.collections.js');


var MyMoviesView = Backbone.View.extend({
    el: '#content',
    template: template,
    events: {
        'click #back': 'back',



    },

    initialize: function(params){
        var ratingsModel = new RatingsModel()
        this.model = ratingsModel;
        this.router = params.router;


    },
    back: function(){
        if(this.id==require('../user.model.js').id){
            this.router.navigate('profile',true)
        }
        else{
            this.router.navigate('profile/?search='+this.id,true)

        }

    },

    render: function (id) {
        this.id=id;

        this.model.url = '/api/movies/?user='+id;



        return this.model.fetch()
                .done(() => {
                console.log(this.model.toJSON())

        this.$el.html(this.template(this.model.toJSON()));
    });





    },






});

module.exports = MyMoviesView;
/**
 * Created by tanle on 04.11.2016.
 */
