var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voting = new Schema({
    messageId: { type: String, require: true, unquie: true }, // messageId
    groupId: { type: Schema.Types.ObjectId, ref: 'subscriptionList' },
    fileId: { type: String },
    fileType: { type: String },
    bySender: { type: String },
    score: { type: Number, default: 0 },
    votedGroupMember: [{ type: Number }],
    status: { type: Number, options: [0, 1] },
    createAt: { type: Date, default: Date.now() }
}, { collection: 'voting' });

module.exports = mongoose.model('voting', voting)
