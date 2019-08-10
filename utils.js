const { SubscriptionListModel, ImageModel } = require('./models')

module.exports = {
    sendPhoto: (bot) => {
        return new Promise (async(resolve, reject)=>{
            let sublist = await SubscriptionListModel.find()
            try {
                for (let idx in sublist) {
                    let { subscriberId, _id } = sublist[idx]
                    let singleImage = await ImageModel.findOne({ sendedTo: { "$ne": _id } }).sort({ createAt: 1 })
                    if (!singleImage) { continue; }
                    await ImageModel.findByIdAndUpdate(singleImage._id, { $push: { sendedTo: _id } })
                    await bot.sendMessage(subscriberId, 'Daily Photo')
                    await bot.sendPhoto(subscriberId, singleImage.fileId)
                    resolve()
                }
            } catch(err){
                reject(err)
            }
        })
    },
    reset: () => {
        return new Promise(async (resolve, reject)=>{
            try {
                await ImageModel.updateMany({sendedTo: []})
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }
}