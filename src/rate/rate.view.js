var Backbone = require('backbone');
var RateModel = require('./rate.model');
var template = require('./rate.view.hbs');
var $ = require('jquery');
require("./rate.scss");
var Movie =require('./movie.model')
var movieTemplate = require('./movie.view.hbs')
var rateMovieTemplate = require('./ratemovie.view.hbs')
var user = require('../user.model.js')

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

var RateMovieView = Backbone.View.extend({
    el: '#login_overlay',
    template: rateMovieTemplate,
    events:{
        'click': 'onClick'
    },
    initialize: function (option) {
        this.router = option.router;
        this.movie = option.movieId;
    },
    onClick: function(e) {

        if (e.target.id === 'login_overlay') {
            this.$el.css('display','none');

            this.router.navigate('rate',true);

            this.$el.removeData().unbind();

        }


        else if(e.target.id=='str5' ||e.target.id=='str4'||e.target.id=='str3'||e.target.id=='str2'||e.target.id=='str1'){

            $.ajax({
                url: '/api/rate/',
                type: 'POST',
                data: {
                    'movieId': this.movie,
                    'ratingValue': e.target.value,
                    'userID': user.id


                }}).done((response)=>{
                this.$el.css('display','none');

                this.router.navigate('rate',true);
                this.undelegateEvents();

                this.$el.removeData().unbind();
        })

        }
    },
    render: function (el) {

        $('#login_overlay').css({'display': 'flex'});
        console.log(el)
        this.$el.html(this.template(el))
        return this;
    }


});
var RateView = Backbone.View.extend({
        tagName: 'ul',
        el: '#content',

        template:template,
        router: '',

        events: {
            'submit #register-form': 'onRegister',
            'click #next': 'next',
            'click img': 'showMovie'
        },

        initialize: function (params) {
            var rateModel = new RateModel();
            this.model = rateModel;
            this.router = params.router;
        },
        showMovie: function(e){

            var id = $(e.currentTarget).data("id");
            for (var x = 0; x<this.model.get('movies').length; x++){
                if (this.model.get('movies')[x]['movieName']==id){
                    var rateMovieView = new RateMovieView({router:this.router, movieId:this.model.get('movies')[x]['movieId']});
                    rateMovieView.render(this.model.get('movies')[x])
                }
            }



        },
        next: function () {
            this.model.url=this.model.get('next')
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

module.exports = RateView;
/**
 * Created by tanle on 23.09.2016.
 */
