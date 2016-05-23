var mongoose = require('mongoose');

var schifezzaMessageSchema = mongoose.Schema({
  type: String,
  username: String,
  description: String,
  value: Number,
  date: Date,
});

module.exports = mongoose.model('SchifezzaMessage', schifezzaMessageSchema);
