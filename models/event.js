var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  type: String,
  date: Date,
  description: String,
  value: Number
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;