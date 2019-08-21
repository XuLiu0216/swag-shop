var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var saleItem = new Schema({
  products:[{type: ObjectId, ref:'Product'}],
  relatedItem:[{type: ObjectId, ref:'Product'}]
})


module.exports = mongoose.model('SaleItem', saleItem);
