/**
 * Created by muhammadmuhaimin on 2016-01-01.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CustomerSchema   = new Schema({
  email: { type: String, trim: true, validate: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, unique: true },
  ticketNum: { type: Number, unique: true },
  isReady: { type: Boolean, default: false, required: true }
});


//module.exports = mongoose.model('Customer', CustomerSchema);
module.exports = function( autoIncrement ){
  CustomerSchema.plugin(autoIncrement.plugin, { model: 'Customer', field: 'ticketNum' });
  return mongoose.model('Customer', CustomerSchema);
}