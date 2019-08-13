var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var image = new Schema({
    fileId: { type: String, unique: true, require: true },
    sender: { type: String, require: true },
    score: { type: Number, require, default: 0 },
    createAt: { type: Date, default: Date.now},
    sendedTo: [{ type: Schema.Types.ObjectId, ref: 'subscriptionList' }]
}, { collection: 'image' });

module.exports = mongoose.model('image', image)
