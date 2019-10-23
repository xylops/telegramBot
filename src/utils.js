const { isEmpty } = require('lodash')
const { SubscriptionListModel, MediaModel } = require('./models')


let sendMedia = (bot, targetId, caption) => {
    return new Promise(async (resolve, reject) => {

        try {
            let subscriberInfo = await SubscriptionListModel.findOne({ subscriberId: targetId })
            if (isEmpty(subscriberInfo)) { reject('Not Subscribe'); return; }

            let availableMediaList = await MediaModel.find({ sendedTo: { "$ne": subscriberInfo._id } })
            if (isEmpty(availableMediaList)) { reject('Nothing available'); return; }

            let randomNumber = Math.floor(Math.random() * availableMediaList.length)
            let selectedMedia = availableMediaList[randomNumber]
            let { fileId, type, _id } = selectedMedia

            switch (type) {
                case 'image':
                    bot.telegram.sendPhoto(targetId, fileId, { caption })
                    break;
                case 'video':
                    bot.telegram.sendVideo(targetId, fileId, { caption })
                    break;
                case 'animation':
                    bot.telegram.sendAnimation(targetId, fileId, { caption })
                    break;
            }

            await MediaModel.findByIdAndUpdate(_id, { $push: { sendedTo: subscriberInfo._id } })
            resolve()

        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

let scheduleSendMedia = async (bot) => {
    let subscriberList = await SubscriptionListModel.find()
    for(let item of subscriberList){
        try {
            await sendMedia(bot, item.subscriberId, 'Daily Photo')
        } catch (err){
            console.log(err)
        }
    }
}

let reset = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await MediaModel.updateMany({ sendedTo: [] })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    sendMedia,
    scheduleSendMedia,
    reset
}