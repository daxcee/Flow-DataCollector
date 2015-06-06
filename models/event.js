var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    FBId: String,
    pid: String,
    date: String,
    title: String,
    venue: String,
    city: String,
    country: String,
    artists: []
});

module.exports = mongoose.model('Event', eventSchema);