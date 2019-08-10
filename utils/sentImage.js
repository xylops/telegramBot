const { SubscriptionListModel, ImageModel } = require('../models')

module.exports = {
    sentPhoto: async (bot) => {
        let sublist = await SubscriptionListModel.find()
        for (let idx in sublist) {
            let { subscriberId, _id } = sublist[idx]
            let singleImage = await ImageModel.findOne({ sendedTo: { "$ne": _id } }).sort({ createAt: 1 })
            if (!singleImage) { continue; }
            await ImageModel.findByIdAndUpdate(singleImage._id, { $push: { sendedTo: _id } })
            bot.sendMessage(subscriberId, 'Daily Photo')
            bot.sendPhoto(subscriberId, singleImage.fileId)
        }
    },
    reset: async (bot) => {
        await ImageModel.updateMany({sendedTo: []})
    }
}