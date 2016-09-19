var Backbone = require('backbone');
require('./lib/sync.js');
require('./index.scss');
var $ = require('jquery');

var LoginView = require('./login/login.view');
var RegisterView = require('./register/register.view');
var ProfileView = require('./profile/profile.view');
var MenuView = require('./menu/menu.view');
var userModel = require('./user.model');
var MembershipView = require('./membership/membership.view');
var LandingView = require('./landing/landing.view');
var DeniedView = require('./denied/denied.view');
var VoteView = require('./vote/vote.view');

var AppRouter = Backbone.Router.extend({

  initialize: function () {
    this.loginView = new LoginView({router: this});
    this.registerView = new RegisterView({router: this});
    this.profileView = new ProfileView({router: this});
    this.landingView = new LandingView({router: this});
    this.menuView = new MenuView({});
    this.voteView = new VoteView({router: this});
    this.membershipView = new MembershipView({router:this});
    this.deniedView = new DeniedView({router: this});
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
    'profile': 'profile',
    'editProfile': 'editProfile',
    'login': 'login',
    'register': 'register',
    'logout': 'logout',
    'landing': 'landing',
    'membership': 'membership',
    'denied': 'denied',
    'vote': 'vote'
  },

  membership: function () {
    this.membershipView.fetchAndRender();
    this.toggleMenu(true);
    this.menuView.menuOpen = false;
    this.menuView.renderMenuAndProfileImage();
  },

  vote: function () {
    this.toggleMenu(true);
    this.voteView.fetchAndRender();
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
    this.landing();
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
    $('#vidplayer').prop('muted', true);
  },

  register: function () {
    this.landing();
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
    $('#vidplayer').prop('muted', true);
  },

  denied: function () {
    var errorMessage = "Ukjent brukernavn og/eller passord";
    this.landing();
    $('#login_overlay').css({'display': 'flex', 'opacity': '1'});
    $('#landing div, img').css({opacity: 0.1});
    this.deniedView.render(errorMessage);
    this.toggleMenu(false);
    $('#vidplayer').prop('muted', true);
  },



  toggleMenu: function (show = true) {
    $('.menuhead').toggle(show);
    if (show) {
      this.menuView.startMenu();
      $('#vidplayer').prop('muted', true);
    }
  },

  logout: function () {
    localStorage.removeItem('x-access-token');
    sessionStorage.removeItem('moods-userId');
    userModel.clear();
    userModel.set(userModel.defaults);
    this.navigate('landing', true);
  },

  editProfile: function() {
    this.toggleMenu(true);
    this.profileView.isEditing = true;
    this.profileView.fetchAndRender(); //test
    this.menuView.menuOpen = false; //test
    this.profileView.render();
  },

  resetHeader: function () {
    $('header').removeClass('stay');
  }

});

new AppRouter();
Backbone.history.start();
