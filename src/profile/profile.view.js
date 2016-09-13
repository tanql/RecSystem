var Backbone = require('backbone');
Backbone.Validation = require('backbone-validation');
require('./profile.scss');
var $ = require('jquery');
var _ = require('underscore');
var template = require('./profile.view.hbs');
var editTemplate = require('./profileEdit.view.hbs');
var moment = require('moment');
var fbLogin = require('../lib/fb-login');
moment.locale('nb');
window.jQuery = $;
window.$ = $;
var dotdotdot = require('dotdotdot');

var ProfileView = Backbone.View.extend({
    el: '#content',
    userTemplate: template,
    events: {
        'click .edit-profile-link': 'startEdit',
        'click .intDiv': 'updateInt',
        'submit .userEdit': 'onSubmit',
        'click .exit-editing-link': 'onAbort',
        'change #user-name': 'changeName',
        'change #user-email': 'changeEmail',
        'change #user-username': 'changeUsername',
        'change #user-postCode': 'changePostCode',
        'change #user-birthday-day': 'changeBirthday',
        'change #user-birthday-month': 'changeBirthday',
        'change #user-birthday-year': 'changeBirthday',
        'change #user-interests': 'changeInterests',
        'click #fb-connect-link': 'onFbConnect'
    },

    initialize: function(params){
        this.model = require('../user.model');
        this.router = params.router;
        Backbone.Validation.bind(this, {
            forceUpdate: true,
            valid: (view, attr) => {
                this.$(`[name=${attr}]`).removeClass('invalid');
                this.$(`text.user-${attr}`).text('');
            },
            invalid: (view, attr, error) => {
                this.$(`[name=${attr}]`).addClass('invalid');
                //console.log(attr);
                this.$(`text.user-${attr}`).text(error);
            }
        });

    },

    render: function (options = {}) {
        this.template = (this.isEditing) ? editTemplate : template;
        this.$el.html(this.template(this.getTemplateData(options)));
        this.$('.nameOnRibbon').dotdotdot({
            watch       : true,
            after       : '#ribbonLastName',
            ellipsis    : ''
        });

        var intR = this.model.get('interests');
        if (intR.herre === false){
            this.$('#img-herre').addClass('isFalse');

        }
        if (intR.kvinne === false)
            this.$('#img-kvinne').addClass('isFalse');
        if (intR.kids === false)
            this.$('#img-kids').addClass('isFalse');
        if (intR.sport === false)
            this.$('#img-sport').addClass('isFalse');

        fbLogin.initFacebookLogin('content');

    },

    getTemplateData: function (options = {}) {
        var day = this.model.get('dateOfBirthDay');
        var month = this.model.get('dateOfBirthMonth');
        var year = this.model.get('dateOfBirthYear');
        if (day && month && year){
            var birthdayFormatted = moment().year(year).month(month - 1).date(day).format('Do MMMM YYYY');
        } else {
            var birthdayFormatted = '';
        }
        var firstName = this.model.get('name').substring(0, this.model.get('name').lastIndexOf(" "));
        var lastName = this.model.get('name').split(" ").pop();
        var membershipImage = "public/images/membershipimages/" + this.model.get('title').toLowerCase().replace(/\s+/g, '') + ".jpg";
        var profileImage = this.model.get('image');
        var facebookUserId = this.model.get('facebookUserId');
        return _.extend(this.model.attributes, {message: options.message}, {birthdayFormatted: birthdayFormatted}, {firstName: firstName},
            {lastName: lastName}, {membershipImage: membershipImage}, {profileImage: profileImage}, {facebookUserId: facebookUserId});

    },

    fetchAndRender: function (options = {}) {
        this.model.url = "/api/profile/" + this.model.id;
        return this.model.fetch()
          .done(() => {
            this.model.saveState();
            this.render(options);
            var intR = this.model.get('interests');

            if (intR.herre === false)
                this.$('#img-herre').addClass('isFalse');
            if (intR.kvinne === false)
                this.$('#img-kvinne').addClass('isFalse');
            if (intR.kids === false)
                this.$('#img-kids').addClass('isFalse');
            if (intR.sport === false)
                this.$('#img-sport').addClass('isFalse');
          });
    },

    startEdit: function(e) {
        e.preventDefault();
        this.router.navigate('editProfile', true);
        this.$el.html(editTemplate(this.getTemplateData()));
    },

    updateInt: function(e) {
        e.preventDefault();
        $("#img-" + $(e.currentTarget).attr("id").split("-").pop()).toggleClass('isFalse');
    },

    onFbConnect: function () {
      FB.login(() => {
        FB.getLoginStatus(response => {
          fbLogin.mergeAccounts(this.model.id, response, (tokenResponse) => {
            this.fetchAndRender({'message': 'Du har nå koblet sammen kontoene dine!'});
            this.router.menuView.renderMenuAndProfileImage(); //updates profileImage in menu if changed on the profile
          });
        });
      });
      return false;
    },

    onSubmit: function (e) {
        e.preventDefault();
        if (this.model.isValid(true)){
            this.changeInterests(e);
            this.saveChanges();
        }
    },

    onAbort: function (e) {
        e.preventDefault();
        var image=this.model.get('image');

        this.model.restoreState();
        this.model.set('image', image);
        this.router.navigate('profile', true);
    },

    saveChanges: function () {
        this.model.url = '/api/users/' + this.model.id;
        this.model.save()
            .done(() => {
                this.router.navigate('profile', true);
            });
    },

    changeName: function (e) {
        e.preventDefault();
        this.model.set('name', this.$('#user-name').val());
        this.model.isValid('name');
    },

    changeUsername: function(e){
        e.preventDefault();
        this.model.set('username', this.$('#user-username').val());
        this.model.isValid('username');
    },

    changeEmail: function(e){
        e.preventDefault();
        this.model.set('email', this.$('#user-email').val());
        this.model.isValid('email');
    },

    changePostCode: function(e){
        e.preventDefault();
        this.model.set('postCode', this.$('#user-postCode').val());
        this.model.isValid('postCode');
    },

    changeBirthday: function(e){
        e.preventDefault();
        if(this.$('#user-birthday-day').val() !== this.model.get('dateOfBirthDay')){
            this.model.set('dateOfBirthDay', this.$('#user-birthday-day').val());
            this.model.isValid('dateOfBirthDay');

        }
        if(this.$('#user-birthday-month').val() !== this.model.get('dateOfBirthMonth')){
            this.model.set('dateOfBirthMonth', this.$('#user-birthday-month').val());
            this.model.isValid('dateOfBirthMonth');
        }
        if(this.$('#user-birthday-year').val() !== this.model.get('dateOfBirthYear')){
            this.model.set('dateOfBirthYear', this.$('#user-birthday-year').val());
            this.model.isValid('dateOfBirthYear');
        }
    },

    changeInterests: function (e) {
        e.preventDefault();
        var intR = this.model.get('interests');
        intR.herre = !($("#img-herre").hasClass('isFalse'));
        intR.kvinne = !($("#img-kvinne").hasClass('isFalse'));
        intR.kids = !($("#img-kids").hasClass('isFalse'));
        intR.sport = !($("#img-sport").hasClass('isFalse'));
    }
});

module.exports = ProfileView;
