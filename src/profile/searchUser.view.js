/**
 * Created by tanle on 14.11.2016.
 */
var Backbone = require('backbone');
Backbone.Validation = require('backbone-validation');
require('./profile.scss');
var $ = require('jquery');
var _ = require('underscore');
var template = require('./searchUser.view.hbs');
var moment = require('moment');
var SearchModel = require('./searchUser.model.js');
moment.locale('nb');
window.jQuery = $;
window.$ = $;

var SearchUserView = Backbone.View.extend({
    el: '#content',
    userTemplate: template,
    events: {
        'click #searchbutton': 'search',

        'click #seeAlls': 'seeAll'



    },

    initialize: function(params){
        this.router = params.router;
        this.model = new SearchModel()


    },
    search: function(){
        this.model.url = "/api/users/?user="+this.$('#searchuser').val();
        return this.model.fetch()
                .done(() => {

                this.render();

    });
},

seeAll: function(){
    this.router.navigate('ratedMovies/?id='+this.model.get('userID'),true);
},

render: function () {

    this.template = (this.isEditing) ? editTemplate : template;
    this.$el.html(this.template(this.getTemplateData()));





},

getTemplateData: function () {
    return this.model.attributes

},

fetchAndRender: function (id) {
    this.model.url = "/api/users/?user="+id;
    return this.model.fetch()
            .done(() => {

    this.render();

});
},






});

module.exports = SearchUserView;
