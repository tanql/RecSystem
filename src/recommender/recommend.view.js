var Backbone = require('backbone');
var RateModel = require('./recommend.model.js');
var template = require('./recommend.view.hbs');
var $ = require('jquery');
require("./rate.scss");
var Movie =require('../rate/movie.model');
var movieTemplate = require('../rate/movie.view.hbs');
var filterByYear = require('./filter.view.hbs');
var filterByGender = require('./filtergender.view.hbs');
var MovieView = Backbone.View.extend({
    tagName: 'li',
    initialize: function () {
        this.template = movieTemplate;
        this.render();
    },
    render: function () {


        this.$el.html(this.template(this.model.toJSON()))
        return this;
    }


});

var FilterGenderView = Backbone.View.extend({
    el: '#login_overlay',
    template: filterByGender,
    events:{
        'click': 'onClick',
        'click #filtersubmitt': 'filterSubmitt'

    },
    initialize: function (option) {
        this.router = option.router;
        this.parent = option.parent
    },
    onClick: function(e) {

        if (e.target.id === 'login_overlay') {
            this.$el.css('display','none');

            this.router.navigate('recommend',true);
            this.undelegateEvents();

            this.$el.removeData().unbind();

        }


    },

        filterSubmitt: function (e) {
            e.preventDefault();

            this.$el.css('display','none');

            $('#landing').css('display','none');
            $('#content').css('display','inherit');
            this.parent.destroy()
            var recommendView = new RecommendView({router:this.router})
            recommendView.nextfilter('/api/recommend/?filter='+this.$('#gender').val())
            this.undelegateEvents();

            this.$el.removeData().unbind();




        },
    render: function () {

        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template())
        return this;
    }


});

var FilterView = Backbone.View.extend({
    el: '#login_overlay',
    template: filterByGender,
    events:{
        'click': 'onClick',
        'click #filtersubmitt': 'filterSubmitt'

    },
    initialize: function (option) {
        this.router = option.router;
        this.parent = option.parent
    },
    onClick: function(e) {

        if (e.target.id === 'login_overlay') {
            this.$el.css('display','none');

            this.router.navigate('recommend',true);
            this.undelegateEvents();

            this.$el.removeData().unbind();

        }


    },

    filterSubmitt: function (e) {
        e.preventDefault();

        this.$el.css('display','none');

        $('#landing').css('display','none');
        $('#content').css('display','inherit');
        this.parent.destroy()
        console.log(this.$('#period').val())
        var recommendView = new RecommendView({router:this.router})
        recommendView.nextfilter('/api/recommend/?'+this.$('#period').val()+'='+this.$('#year').val())
        this.undelegateEvents();

        this.$el.removeData().unbind();




    },
    render: function () {

        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template())
        return this;
    }


});
var RecommendView = Backbone.View.extend({
        tagName: 'ul',
        el: '#content',

        template:template,
        router: '',

        events: {
            'submit #register-form': 'onRegister',
            'click #nextrec': 'nextrec',
            'click img': 'showMovie',
            'click #filter': 'filterByYear',
            'click #filterGender': 'filterByGender'

        },

        initialize: function (params) {
            var rateModel = new RateModel();
            this.model = rateModel;
            this.router = params.router;

        },
        destroy: function() {

        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        this.$el.removeData().unbind();

        // Remove view from DOM

    },
    filterByGender: function(){
        var filterVew = new FilterGenderView({router:this.router, parent:this});
        filterVew.render()
    },

        filterByYear: function(){
            var filterVew = new FilterView({router:this.router, parent:this});
            filterVew.render()
        },
        nextfilter: function (url) {
            this.model.url=url;
            console.log(this.model)
            this.render()

        },
        nextrec: function () {
            this.model.url=this.model.get('next')
            console.log(this.model.url)
            this.render()

        },
        addModel: function(i){
            var movie=new Movie(this.model.get('movies')[i]);
            $.ajax({
                url: 'http://www.omdbapi.com/?t='+movie.get('movieName').substring(0,movie.get('movieName').length-5),
                type: 'GET',
            })
                .done((response) => {

                movie.set('movieUrl',response.Poster)
            var movieName=movie.get('movieName').replace('+',' ');

            for (var x = 0, len = movieName.length; x < len; x++) {
                movieName=movieName.replace('+',' ');

            }
            movie.set('movieName', movieName);
            var movieView = new MovieView({model: movie});
            this.$('.rate_view').append(movieView.render().el);





            });
        },



        render: function () {
            return this.model.fetch()
                    .done(()=>{

            this.$el.html(this.template(this.model.toJSON()));

                    for ( var i = 0; i <this.model.get('movies').length; i++) {
                        this.addModel(i)
                    }






});

},


});

module.exports = RecommendView;
/**
 * Created by tanle on 23.09.2016.
 */
