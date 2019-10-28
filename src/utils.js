const { isEmpty } = require('lodash')
const { SubscriptionListModel, MediaModel, VotingModel } = require('./models')
const { Extra } = require('telegraf');


let sendMedia = (bot, targetId, caption) => {
    return new Promise(async (resolve, reject) => {

        try {
            let subscriberInfo = await SubscriptionListModel.findOne({ subscriberId: targetId })
            if (isEmpty(subscriberInfo)) { reject('Not Subscribe'); return; }

            let availableMediaList = await MediaModel.find({ sendedTo: { "$ne": subscriberInfo._id } })
            if (isEmpty(availableMediaList)) { reject('Nothing available'); return; }

            let randomNumber = Math.floor(Math.random() * availableMediaList.length)
            let selectedMedia = availableMediaList[randomNumber]
            let { fileId, type, sender, _id } = selectedMedia

            const extra = Extra.HTML().markup((m) =>
                m.inlineKeyboard([
                    m.callbackButton('1', '1'),
                    m.callbackButton('2', '2'),
                    m.callbackButton('3', '3'),
                    m.callbackButton('4', '4'),
                    m.callbackButton('5', '5')
                ])
            )
            extra.caption = caption

            let sendedMessageInfo = null
            switch (type) {
                case 'image':
                    sendedMessageInfo = await bot.telegram.sendPhoto(targetId, fileId, extra)
                    break;
                case 'video':
                    sendedMessageInfo = await bot.telegram.sendVideo(targetId, fileId, extra)
                    break;
                case 'animation':
                    sendedMessageInfo = await bot.telegram.sendAnimation(targetId, fileId, extra)
                    break;
            }



            let currentVote = await VotingModel.findOne({ groupId: subscriberInfo._id, status: 1 });

            if (!isEmpty(currentVote)) {
                // stop current vote
                await VotingModel.findByIdAndUpdate(currentVote._id, { $set: { status: 0 } }, { new: true })
                await bot.telegram.editMessageReplyMarkup(targetId, currentVote.messageId)
                let score = Math.floor(currentVote.score / currentVote.votedGroupMember)
                let result = isEmpty(score) ? 0 : score
                let oldCaption = 'Total Score ' +  result
                await bot.telegram.editMessageCaption(targetId, currentVote.messageId, '', oldCaption )
            }

            let newVote = new VotingModel({
                messageId: sendedMessageInfo.message_id, // messageId
                groupId: subscriberInfo._id,
                bySender: sender,
                fileId,
                status: 1
            })
            await newVote.save()

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
    for (let item of subscriberList) {
        try {
            await sendMedia(bot, item.subscriberId, 'Daily Photo')
        } catch (err) {
            console.log(err)
        }
    }
}

let reset = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await MediaModel.updateMany({ sendedTo: [] })
            await VotingModel.deleteMany({})
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

let stockCheck = async (chatId) => {
    let subscriberInfo = await SubscriptionListModel.findOne({ subscriberId: chatId })
    let list = await MediaModel.find({ sendedTo: { '$ne': subscriberInfo._id } });
    return list.length
}

let weeklyReport = async (bot) => {
    
}

module.exports = {
    sendMedia,
    scheduleSendMedia,
    reset, 
    stockCheck,
    weeklyReport
}