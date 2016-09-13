/**
 * Created by gelvin on 29.07.2016.
 */

var mongoose = require('mongoose');

var VoteItemSchema = new mongoose.Schema({
  voteDescription:String,
  voteTitle:String,
  imageLink:String,
  description:String,
  like:Number
});


module.exports = mongoose.model('Vote', VoteItemSchema);