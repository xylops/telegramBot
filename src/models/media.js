var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var media = new Schema({
    fileId: { type: String, unique: true, require: true },
    sender: { type: String, require: true },
    senderId: { type: String, require: true },
    createAt: { type: Date, default: Date.now },
    sendedTo: [{ type: Schema.Types.ObjectId, ref: 'subscriptionList' }],
    type: { type: String }
}, { collection: 'media' });

module.exports = mongoose.model('media', media)
