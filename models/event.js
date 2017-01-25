var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  user: String,  
  type: String,
  value: Number,
  date: Date,
  description: String
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;