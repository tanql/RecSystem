var Backbone = require('backbone');
require('./lib/sync.js');
require('./index.scss');
var $ = require('jquery');

var LoginView = require('./login/login.view');
var RegisterView = require('./register/register.view');
var ProfileView = require('./profile/profile.view');
var MenuView = require('./menu/menu.view');
var userModel = require('./user.model');
var LandingView = require('./landing/landing.view');
var DeniedView = require('./denied/denied.view');
var RateView = require('./rate/rate.view');
var RecommendView = require('./recommender/recommend.view.js');
var MyMoviesView = require('./profile/mymovies.view.js');
var SearchUserView = require('./profile/searchUser.view.js');
var AppRouter = Backbone.Router.extend({

        initialize: function () {
            this.loginView = new LoginView({router: this});
            this.registerView = new RegisterView({router: this});
            this.profileView = new ProfileView({router: this});
            this.landingView = new LandingView({router: this});
            this.menuView = new MenuView({router:this});
            this.deniedView = new DeniedView({router: this});
            this.rateView = new RateView({router: this});
            this.recommendView = new RecommendView({router: this});
            this.myMoviesView = new MyMoviesView({router: this});
            this.searchUserView = new SearchUserView({router: this});

            this.on('route', this.resetHeader);

            // Window size.
            this.mq = window.matchMedia('(min-width: 35em)');
        },

        getUsernameFromArgs: function (args) {
            if (args[0] !== null && args[0].indexOf('username') > -1) {
                return [args[0].split('=')[1]];
            }
            return args;
        },

        execute: function (callback, args, name) {
            if (callback) callback.apply(this, this.getUsernameFromArgs(args));
        },

        routes: {
            '': 'landing',
            'recommend':'recommend',
            'profile': 'profile',
            'profile/?search=:id': 'searchProfile',
            'editProfile': 'editProfile',
            'login': 'login',
            'register': 'register',
            'logout': 'logout',
            'landing': 'landing',
            'denied': 'denied',
            'ratedMovies/?id=:id': 'ratedMovies',
            'rate': 'rate',
            'rate/?search=:id': 'searchRate'
        },
    searchProfile:function(id){
        this.searchUserView.render(id);
        this.toggleMenu(true);
        this.menuView.menuOpen = false;
        this.menuView.renderMenuAndProfileImage();
    },
    searchRate: function (id) {
        $('#login_overlay').css('display','none');
        $('#content').css('display','flex');
        $('#lading').css('display','none');
        this.rateView.render(id);
        this.toggleMenu(true);
        this.menuView.menuOpen = false;
        this.menuView.renderMenuAndProfileImage();
    },
        ratedMovies: function(id){
            $('#login_overlay').css('display','none');
            $('#content').css('display','flex');
            $('#lading').css('display','none');
            this.myMoviesView.render(id)
            this.toggleMenu(true);
            this.menuView.menuOpen = false;
            this.menuView.renderMenuAndProfileImage();



        },
        rate: function(){
            $('#login_overlay').css('display','none');
            $('#content').css('display','flex');
            $('#lading').css('display','none');
            this.recommendView.setFalse();
            this.rateView.render();
            this.toggleMenu(true);
            this.menuView.menuOpen = false;
            this.menuView.renderMenuAndProfileImage();

        },

        recommend: function(){
            $('#login_overlay').css('display','none');
            $('#content').css('display','flex');
            $('#lading').css('display','none');
            this.recommendView.model.url='api/recommend/?page=1';
            this.recommendView.render();
            this.toggleMenu(true);
            this.menuView.menuOpen = false;
            this.menuView.renderMenuAndProfileImage();


        },



        profile: function () {

            this.toggleMenu(true);
            this.profileView.isEditing = false;
            this.profileView.fetchAndRender();
            this.menuView.menuOpen = false;
            this.menuView.renderMenuAndProfileImage();


        },



        landing: function () {
            $('#login_overlay').css('display','none');
            $('#content').css('display','none');
            $('#landing').css('display','flex');
            $('#landing .background, #item_container').css('opacity','1');
            this.landingView.render();
            this.toggleMenu(false);

        },

        login: function (username) {
            $('#login_overlay').css({'display': 'flex', 'opacity': '0'});
            // Animates if screen is large aka on desktop.
            if (this.mq.matches) {
                $('#login_overlay').animate({opacity: 1}, 500);
                $('#landing div, img').animate({opacity: 0.1},1500);
            } else {
                $('#login_overlay').css({opacity: 1});
                $('#landing div, img').css({opacity: 0.1});
            }
            this.loginView.render({username});
            this.toggleMenu(false);


        },

        register: function () {
            $('#login_overlay').css({'display': 'flex', 'opacity': '0'});
            // Animates if screen is large aka on desktop.
            if (this.mq.matches) {
                $('#login_overlay').animate({opacity: 1}, 500);
                $('#landing div, img').animate({opacity: 0.1},1500);
            } else {
                $('#login_overlay').css({opacity: 1});
                $('#landing div, img').css({opacity: 0.1});
            }
            this.registerView.render();
            this.toggleMenu(false);


        },

        denied: function () {
            var errorMessage = "Ukjent brukernavn og/eller passord";
            this.landing();
            $('#login_overlay').css({'display': 'flex', 'opacity': '1'});
            $('#landing div, img').css({opacity: 0.1});
            this.deniedView.render(errorMessage);
            this.toggleMenu(false);
        },



        toggleMenu: function (show = true) {
            $('.menuhead').toggle(show);
            if (show) {
                this.menuView.startMenu();
                $('#vidplayer').prop('muted', true);
            }
        },

        logout: function () {
            userModel.url = "api/logout/";
            $.ajax({
                url: '/api/logout/',
                type: 'GET'
            })
                .done((response) => {
                sessionStorage.clear();

            this.navigate('landing', true);
        }).fail((response) => {

    })

},

editProfile: function() {
    $('#login_overlay').css('display','none');
    $('#content').css('display','flex');
    $('#lading').css('display','none');
    this.toggleMenu(true);
    this.profileView.isEditing = true;
    this.profileView.fetchAndRender();
    this.menuView.menuOpen = false;
    this.menuView.renderMenuAndProfileImage();

    this.profileView.render();

},

resetHeader: function () {
    $('header').removeClass('stay');
}

});

new AppRouter();
Backbone.history.start();
