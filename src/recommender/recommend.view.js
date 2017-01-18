var Backbone = require('backbone');
var RateModel = require('./recommend.model.js');
var template = require('./recommend.view.hbs');
var $ = require('jquery');
require("./rate.scss");
var Movie =require('../rate/movie.model');
var movieTemplate = require('./detail.view.hbs');
var detailMovie = require('./ratemovie.view.hbs')
var filterByYear = require('./filter.view.hbs');
var filterByTime = require('./filtertime.view.hbs');
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
        'click #filtersubmittgender': 'filterSubmitt'
    },
    initialize: function (option) {
        this.router = option.router;
        this.parent = option.parent
    },
    onClick: function(e) {
        if (this.parent.hasRendered == true) {
            if (e.target.id === 'login_overlay') {
                $('#login_overlay').css('display', 'none');
                $('#content').css('display', 'flex');
                $('#lading').css('display', 'none');
            }
        }
    },
        filterSubmitt: function (e) {
            $('#login_overlay').css('display','none');
            $('#content').css('display','flex');
            $('#lading').css('display','none');
            this.parent.nextfilter('/api/recommend/?filter='+this.$('#gender').val())
        },
    render: function () {
        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template())
        return this;
    }
});
var FilterTimeView = Backbone.View.extend({
    el: '#login_overlay',
    template: filterByTime,
    events:{
        'click': 'onClick',
        'click #filtersubmitttime': 'filterSubmitt'
    },
    initialize: function (option) {
        this.router = option.router;
        this.parent = option.parent

    },
    onClick: function(e) {
        if (this.parent.hasRendered == true) {
            if (e.target.id === 'login_overlay') {
                $('#login_overlay').css('display', 'none');
                $('#content').css('display', 'flex');
                $('#lading').css('display', 'none');

                this.router.navigate('recommend', true);
            }
        }
    },
    filterSubmitt: function (e) {
        $('#login_overlay').css('display','none');
        $('#content').css('display','flex');
        $('#lading').css('display','none');
        this.parent.model.url="/api/recommend/?time="+this.$('#time').val(),
        this.parent.render(this.$('#time').val())
    },
    render: function () {
        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template())
        return this;
    }
});
var FilterView = Backbone.View.extend({
    el: '#login_overlay',
    template: filterByYear,
    events:{
        'click': 'onClick',
        'click #filtersubmittyear': 'filterSubmitt'
    },
    initialize: function (option) {
        this.router = option.router;
        this.parent = option.parent;
    },
    onClick: function(e) {
        if (this.parent.hasRendered == true) {
            if (e.target.id === 'login_overlay') {
                $('#login_overlay').css('display','none');
                $('#content').css('display','flex');
                $('#lading').css('display','none');
                this.router.navigate('recommend',true);
            }
        }
    },
    filterSubmitt: function (e) {
        $('#login_overlay').css('display','none');
        $('#content').css('display','flex');
        $('#lading').css('display','none');
        this.parent.nextfilter('/api/recommend/?'+this.$('#period').val()+'='+this.$('#year').val())
    },
    render: function () {
        $('#login_overlay').css({'display': 'flex'});
        this.$el.html(this.template())
        return this;
    }
});
var RateMovieView = Backbone.View.extend({
        el: '#login_overlay',
        template: detailMovie,
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
                    this.router.navigate('recommend', true);
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
var RecommendView = Backbone.View.extend({
        tagName: 'ul',
        el: '#content',
        template:template,
        router: '',
        events: {
            'submit #register-form': 'onRegister',
            'click #nextrec': 'nextrec',
            'click #previousrec': 'previousrec',
            'click .detailMovie': 'showMovie',
            'click #filter': 'filterByYear',
            'click #filterTime': 'filterByTime',
            'click #filterGender': 'filterByGender'
        },
        initialize: function (params) {
            var rateModel = new RateModel();
            this.model = rateModel;
            this.router = params.router;
            this.filterVew = new FilterView({router:this.router, parent:this});
            this.filterGenderView = new FilterGenderView({router:this.router, parent:this});
            this.filterTimeView = new FilterTimeView({router:this.router, parent:this});
            this.hasRendered=false;
        },
    setFalse:function(){
        this.hasRendered=false;
    },
    filterByTime: function(){
        this.filterTimeView.render()
    },
    filterByGender: function(){
        this.filterGenderView.render()
    },

        filterByYear: function(){
            this.filterVew.render()
        },
        nextfilter: function (url) {
            this.model.url=url;
            this.render()

        },
        nextrec: function () {
            this.model.url=this.model.get('next')
            if(this.model.get('next').indexOf('time=') >= 0) {
                this.render(this.model.get('next').slice(this.model.get('next').indexOf('time=')+5));
            }
            else{
                this.render()
            }
        },
    previousrec: function () {
        this.model.url=this.model.get('previous')
        if(this.model.get('previous').indexOf('time=') >= 0) {
            this.render(this.model.get('previous').slice(this.model.get('previous').indexOf('time=')+5));
        }
        else{
            this.render()
        }

    },
        addModel: function(i,time){
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

                movie.set('movieUrl',response.Poster);
                if (response.hasOwnProperty('Runtime')) {
                    if (response.Runtime=='N/A'){
                        var numb=999999999999999;
                    }
                    else{
                        var numb = response.Runtime.match(/\d/g);
                        numb = numb.join("");
                    }
                    movie.set('runtime', parseInt(numb));
                };
            var movieName=movie.get('movieName').replace('+',' ');

            for (var x = 0, len = movieName.length; x < len; x++) {
                movieName=movieName.replace('+',' ');

            }
            movie.set('movieName', movieName);
            if (typeof time == 'string'){
                if (parseInt(numb)<parseInt(time)){
                    var movieView = new MovieView({model: movie});
                    this.$('.recommend_view').append(movieView.render().el);
                }
            }
            else{
                var movieView = new MovieView({model: movie});
                this.$('.recommend_view').append(movieView.render().el);

            }
            });
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
                        newModel['actors']=response.Actors;
                        newModel['plot']=response.Plot;
                        newModel['imdbRating']=response.imdbRating;
                    var rateMovieView = new RateMovieView({router:this.router,parent:this, model:newModel});
                    this.movie=rateMovieView
                    rateMovieView.render()
                })
            }
        }
        },
        render: function (time) {
            this.hasRendered=true;
            return this.model.fetch()
                    .done(()=>{
                    this.$el.html(this.template(this.model.toJSON()));
                    for ( var i = 0; i <this.model.get('movies').length; i++) {
                        this.addModel(i,time)
                    }
});
},
});
module.exports = RecommendView;
/**
 * Created by tanle on 23.09.2016.
 */
