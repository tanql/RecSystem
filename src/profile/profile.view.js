var Backbone = require('backbone');
Backbone.Validation = require('backbone-validation');
require('./profile.scss');
var $ = require('jquery');
var _ = require('underscore');
var template = require('./profile.view.hbs');
var editTemplate = require('./profileEdit.view.hbs');
var moment = require('moment');
moment.locale('nb');
window.jQuery = $;
window.$ = $;
var dotdotdot = require('dotdotdot');

var ProfileView = Backbone.View.extend({
    el: '#content',
    userTemplate: template,
    events: {
        'click #searchbutton': 'search',
        'click .edit-profile-link': 'startEdit',
        'click .intDiv': 'updateInt',
        'click #save': 'onSubmit',
        'click #cancel': 'onAbort',
        'change #user-age': 'changeAge',
        'change #user-interests': 'changeInterests',
        'change #user-email': 'changeEmail',
        'change #user-username': 'changeUsername',
        'change #user-postCode': 'changePostCode',
        'click #seeAll': 'seeAll',
        'click #addGenre': 'addGenre',
        'click #removeGenre': 'removeGenre'



    },

    initialize: function(params){
        this.model = require('../user.model');
        this.router = params.router;

    },
    search: function(){
        this.model.url = "/api/users/?user="+this.$('#searchuser').val();
        $.ajax({
            url: '/api/users/?user='+this.$('#searchuser').val(),
            type: 'GET'
            })
        .done((response) => {

        this.router.navigate('profile/?search='+response.userID)
});
    },
    addGenre: function(){
        this.model.get('interests').push(this.$('#genre').val())
        this.$('#user-interests').val(this.$('#user-interests').val()+','+this.$('#genre').val())


    },
    removeGenre: function(){


        var index = this.model.get('interests').indexOf(this.$('#genre').val());
        if (index > -1) {
            this.model.get('interests').splice(index, 1);
        }
        this.$('#user-interests').val(this.$('#user-interests').val().replace(','+this.$('#genre').val(),""));



    },
    seeAll: function(){
        console.log(this.model.id)
        this.router.navigate('ratedMovies/?id='+this.model.id,true)
    },

    render: function (options = {}) {
        console.log(this.model.id)
        this.template = (this.isEditing) ? editTemplate : template;
        this.$el.html(this.template(this.getTemplateData(options)));





    },

    getTemplateData: function (options = {}) {
        return this.model.attributes

    },

    fetchAndRender: function (options = {}) {
        this.model.url = "/api/users";
        return this.model.fetch()
          .done(() => {
            this.model.saveState();

        this.render(options);

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


    onSubmit: function (e) {
        e.preventDefault();
        if (this.model.isValid(true)){
            this.saveChanges();
        }
    },

    onAbort: function (e) {
        e.preventDefault();
        var image=this.model.get('image');

        this.model.restoreState();
        this.model.set('image', image);
        this.model.set('_id', sessionStorage.getItem('userId'))
        this.router.navigate('profile', true);
    },

    saveChanges: function () {
        this.model.url = '/api/users/' + this.model.id;

        this.model.save()
            .done((response) => {
            console.log(response.toJSON)
            this.router.navigate('profile', true);


    });
    },

    changeAge: function(e){
        e.preventDefault();
        this.model.set('age', this.$('#user-age').val());

    },
    changeInterests: function(e){
        e.preventDefault();
        this.model.set('interests', this.$('#user-interests').val());

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



});

module.exports = ProfileView;
