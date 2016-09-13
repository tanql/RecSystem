/**
 * Created by gelvin on 27.07.2016.
 */
var Backbone = require('backbone');
require('./vote.scss');
var $ = require('jquery');
var _ = require('underscore');
var template = require('./vote.view.hbs');
var headTemplate = require('./votes.view.hbs');
var VoteItemsCollection = require('./vote.collection');
var VoteModel = require('./vote.model');
var userModel = require('../user.model');


var VoteView = Backbone.View.extend ({
  template: template,
  tagName: 'div',
  className: 'vote_container',
  events: {
    'click .likes.liked': 'unlikeItem',
    'click .likes:not(".liked")': 'likeItem'
  },
  render: function () {
    this.$el.html(this.template(this.getTemplateData()));
    return this;
  },
  getTemplateData: function () {
    var isLiked = _.some(userModel.get('votes'), voteId => voteId === this.model.id);
    return _.extend(this.model.attributes, {isLiked});
  },
  likeItem: function (evt) {
    this.model.set('like', this.model.get('like') + 1);
    var votes = userModel.get('votes');
    votes.push(this.model.id);
    userModel.set('votes', votes);
    this.render();
    this.saveVoteChanges();
    return false;
  },
  unlikeItem: function (evt) {
    this.model.set('like', this.model.get('like') - 1);
    var votes = userModel.get('votes');
    var indexToRemove = votes.indexOf(this.model.id);
    if (indexToRemove > -1) {
        votes.splice(indexToRemove, 1);
        userModel.set('votes', votes);
    }
    this.render();
    this.saveVoteChanges();
    return false;
  },
  saveVoteChanges: function () {
    this.model.url = 'api/vote';
    this.model.save()
      .done(() => {
        this.saveUserVote();
      });
  },

  saveUserVote: function () {
    userModel.url = '/api/users/' + userModel.id;
    userModel.save()
      .done(() => {
        console.log(userModel.get('votes'));
      });
  }
});

var VotesView = Backbone.View.extend ({
  template: headTemplate,
  events: {

    'click .vote_title': 'toggleVoteItems'
  },

  initialize: function (params) {
    this.collection = new VoteItemsCollection();
    this.router = params.router;
  },
  render: function () {
    //this.template = template;
    this.$el.html(this.template);
    this.collection.each(function (vote){
      var voteView = new VoteView({model: vote});
      this.$('.votes_container').append(voteView.render().el)
    },this);
  },
  fetchAndRender: function () {
    this.collection.url = "/api/vote";
    return this.collection.fetch()
      .done(() => {
        this.render();
      });
  },

  toggleVoteItems: function () {
    this.$('.votes_container').slideToggle(); //Kan ju goras snyggare da
  }
});

module.exports = VotesView;
