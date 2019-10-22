const { SubscriptionListModel, ImageModel } = require('./models')

module.exports = {
    sendPhoto: (replyWithPhoto, reply) => {
        return new Promise (async(resolve, reject)=>{
            let sublist = await SubscriptionListModel.find()
            try {
                for (let idx in sublist) {
                    let { subscriberId, _id } = sublist[idx]
                    let singleImage = await ImageModel.findOne({ sendedTo: { "$ne": _id } }).sort({ createAt: 1 })
                    if (!singleImage) { continue; }
                    await ImageModel.findByIdAndUpdate(singleImage._id, { $push: { sendedTo: _id } })
                    await replyWithPhoto( 
                            singleImage.fileId , 
                            {
                                caption: 'Daily Photo from ' + singleImage.sender
                            }
                        )
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