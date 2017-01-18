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
        'click': 'onClick',
    },
    initialize: function (option) {
        this.router = option.router;
        this.movie = option.movieId;
        this.parent =option.parent;
        this.hasRendered=true;
        this.model = option.model;
    },

    onClick: function(e) {
        if (this.hasRendered == true) {
            if (e.target.id === 'login_overlay') {
                this.$el.css('display', 'none');
                this.hasRendered=false;
                this.router.navigate('rate', true);
            }
            else if(e.target.id=='str5' ||e.target.id=='str4'||e.target.id=='str3'||e.target.id=='str2'||e.target.id=='str1'){

                $.ajax({
                    url: '/api/rate/',
                    type: 'POST',
                    data: {
                        'movieId': this.model.movieId,
                        'ratingValue': e.target.value,
                    }}).done((response)=>{
                    this.$el.css('display','none');
                this.hasRendered=false;
                this.router.navigate('rate',true);

            })

        }
        }
    },

    render: function () {
        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template(this.model))
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
            'click .individualMovies': 'showMovie',
            'click #previous': 'previous',
            'click #search': 'search'

        },

        initialize: function (params) {
            var rateModel = new RateModel();
            this.model = rateModel;
            this.router = params.router;

            this.movie=null;
        },
        search: function(){
            this.router.navigate('rate/?search='+this.$('#searcharea').val(),true);
            this.$('#searcharea').val('')

        },
        showMovie: function(e){
            var id = $(e.currentTarget).data("id");
            for (var x = 0; x<this.model.get('movies').length; x++){
                if (this.model.get('movies')[x]['movieName']==id){
                    var newModel = this.model.get('movies')[x];
                    if (newModel.movieName.substring(newModel.movieName.length-10,newModel.movieName.length-7)=='The'){
                        var moviename= newModel.movieName.substring(0,newModel.movieName.length-11);
                    }
                    else{
                        var moviename = newModel.movieName.substring(0,newModel.movieName.length-6);
                    }
                    $.ajax({
                        url: 'http://www.omdbapi.com/?t='+moviename,
                        type: 'GET',
                    })
                        .done((response) => {
                    newModel['movieUrl']=response.Poster;
                    var rateMovieView = new RateMovieView({router:this.router,parent:this, model:newModel});
                    this.movie=rateMovieView
                    rateMovieView.render()
                })
                }
            }
        },
    setFalse:function(){
        this.hasRendered=false;
    },

        next: function () {
            this.model.url=this.model.get('next')
            this.render()

        },
        previous: function () {
            this.model.url=this.model.get('previous');
            this.render()

        },
        addModel: function(i){
            var movie=new Movie(this.model.get('movies')[i]);
            if (movie.get('movieName').substring(movie.get('movieName').length-10,movie.get('movieName').length-7)=='The'){
                var moviename= movie.get('movieName').substring(0,movie.get('movieName').length-11)
            }
            else{
                var moviename = movie.get('movieName').substring(0,movie.get('movieName').length-6)
            }
            $.ajax({
                url: 'http://www.omdbapi.com/?t='+moviename,
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

        render: function (url) {
            if(typeof url !== 'undefined'){
                this.model.url = '/api/rate/?search='+this.$('#searcharea').val()

            }
            return this.model.fetch()
                    .done(()=>{
            this.model.url= 'api/rate/?page=1';
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
