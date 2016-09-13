var Backbone = require('backbone');
require('./receipt.scss');
var $ = require('jquery');
var _ = require('underscore');
var template = require('./receipt.view.hbs');
var headTemplate = require('./receipts.view.hbs');
var ReceiptCollection = require('./receipt.collection');

var ReceiptView = Backbone.View.extend({
  template: template,
  initialize: function () {
    this.render();
  },
  render: function () {
    this.$el.html(this.template(this.getTemplateData()));
    if (this.model.get('motattbankkort')> 0) {
      this.$(`.bankcard`).text('Mottatt Bankkort');
    }
    if (this.model.get('totalprice') - this.model.get('motattbankkort') != 0 ){
      this.$('.cash').text('Mottatt Cash');
    }
  },

  getTemplateData: function () {
    var products = this.model.get('items');
    var totalQuantity = 0;
    var vat = this.model.get('totalprice')*0.25;
    var motattcash = '';

    for (var value of products){
      totalQuantity += value.amount;
      if (value.discount){
        var discountPrice = 0;
        discountPrice = value.discount*value.itemprice*.01;
        value.discountPrice = discountPrice;
      }
    }
    this.model.set('items', products);

    if (this.model.get('totalprice') - this.model.get('motattbankkort') != 0 ){
      motattcash = this.model.get('totalprice') - this.model.get('motattbankkort');
    }
    if (this.model.get('motattbankkort') == 0) {
      this.model.set('motattbankkort', '');
    }

    return _.extend(this.model.toJSON(), {totalQuantity: totalQuantity}, {vat: vat}, {motattcash: motattcash});
  }
});

var ReceiptsView = Backbone.View.extend({
  el: '#content',
  template: headTemplate,
  events: {
    'click .receipt': 'closeReceipt',
    'click .print_button': 'printReceipt'
  },

  initialize: function (params) {
    this.collection = new ReceiptCollection();
    this.router = params.router;
  },

  render: function () {
    var empty = this.collection.isEmpty();
    this.$el.html(this.template({empty: empty}));
    this.collection.each(function (receipt) {
      var receiptView = new ReceiptView({model: receipt});
      this.$el.append(receiptView.el)
    },this);
  },

  fetchAndRender: function () {
    var user = require('../user.model');
    this.collection.url="/api/receipts/" + user.id;
    return this.collection.fetch()
      .done(() => {
        this.render();
      });
  },

  printReceipt: function (element) {
    window.print();
  },

  closeReceipt: function (e) {
    if (this.$('.receipt').is(e.target)) {
      window.location.href="#receipt";
    }
  }
});

module.exports = ReceiptsView;
