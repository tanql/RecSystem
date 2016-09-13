/**
 * Created by gelvin on 27.07.2016.
 */

var Backbone = require('backbone');
var VoteItem = require('./vote.model');

var VoteItemsCollection = Backbone.Collection.extend({
  model: VoteItem/*,
  //Somekind of groupBy so that vote items can be grouped
  comparator: function (m1, m2){
  }*/
});

module.exports = VoteItemsCollection;