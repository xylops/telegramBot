var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscriptionList = new Schema({
    subscriberId: { type: String, unique: true, require: true },
    name: { type: String },
    type: { type: String, require: true }
}, { collection: 'subscriptionList' });

module.exports = mongoose.model('subscriptionList', subscriptionList)
