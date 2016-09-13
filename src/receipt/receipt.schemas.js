/**
 * Created by ltanquac on 08.07.2016.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ReceiptSchema = new mongoose.Schema({
  
  store: String,
  userID: ObjectId,
  salesman:String,
  receiptnumber: Number,

  totalprice: Number,
  motattbankkort: Number,
  totaltmottatt: Number,
  dateDay: Number,
  dateMonth: Number,
  dateYear: Number,
  time: String,

  items: [{
    Name: String,
    itemprice: Number,
    amount: Number,
    discount: Number,
    veiledendepris: Number    
  }]
});

module.exports = mongoose.model('Receipt', ReceiptSchema);