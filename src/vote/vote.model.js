/**
 * Created by gelvin on 27.07.2016.
 */
var Backbone = require('backbone');

var VoteItem = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    voteDescription: '',
    voteTitle: '',
    imageLink: '',
    description: '',
    like: ''
  }
});

module.exports = VoteItem;
