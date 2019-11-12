const { isEmpty } = require('lodash')
const { SubscriptionListModel, MediaModel, VotingModel } = require('./models')
const { Extra } = require('telegraf');
const dayjs = require('dayjs');
// const {orderBy} = require('lodash')


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
                let oldCaption = 'Total Score ' + result
                await bot.telegram.editMessageCaption(targetId, currentVote.messageId, '', oldCaption)
            }

            let newVote = new VotingModel({
                messageId: sendedMessageInfo.message_id, // messageId
                groupId: subscriberInfo._id,
                bySender: sender,
                fileId,
                fileType: type,
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
    let year = dayjs().format('YYYY')
    let month = dayjs().format('MM')
    let day = dayjs().subtract(7, 'days').format('DD')
    let list = await VotingModel.find({
        "createAt": { "$gte": new Date(year, month - 1, day), "$lt": Date.now() },
        status: 0,
    }).sort({ score: -1 })
    let top3List = list.splice(0, 3)
    let subscriptionList = await SubscriptionListModel.find({})

    for (let subscriber of subscriptionList){
        let targetId = subscriber.subscriberId
        await bot.telegram.sendMessage(targetId, 'Weekly Report: ')
        for (var i = 0; i < top3List.length ; i++ ) {
            let { fileId, fileType, bySender, score } = top3List[i]
            let extra = {
                caption: 'Number ' + (i +1) + '\nUploader:  ' + bySender + '\nTotal Score ' + score
            }
            switch (fileType) {
                case 'image':
                    await bot.telegram.sendPhoto(targetId, fileId, extra)
                    break;
                case 'video':
                    await bot.telegram.sendVideo(targetId, fileId, extra)
                    break;
                case 'animation':
                    await bot.telegram.sendAnimation(targetId, fileId, extra)
                    break;
            }
        }
    }
    await bot.telegram.sendMessage(targetId, ' Media remains:  ' + await stockCheck(targetId)) 
    
}

module.exports = {
    sendMedia,
    scheduleSendMedia,
    reset,
    stockCheck,
    weeklyReport
}