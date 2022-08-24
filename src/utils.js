const { isEmpty } = require('lodash')
const { SubscriptionListModel, MediaModel, VotingModel } = require('./models')
const { Extra } = require('telegraf');
const dayjs = require('dayjs');
// const {orderBy} = require('lodash')


let sendMedia = (bot, targetId, caption) => {
    return new Promise(async (resolve, reject) => {
        console.log( targetId + ' start media')
        try {
            let subscriberInfo = await SubscriptionListModel.findOne({ subscriberId: targetId })
            if (isEmpty(subscriberInfo)) { reject('Not Subscribe'); return; }
            console.log( targetId + ' gots subscriberInfo')
            

            let availableMediaList = await MediaModel.find({ sendedTo: { "$ne": subscriberInfo._id }, senderId: { "$ne": 742992591 } })
            if (isEmpty(availableMediaList)) { reject('Nothing available'); return; }
            console.log( targetId + ' gots got available List')


            let randomNumber = Math.floor(Math.random() * availableMediaList.length)
            let selectedMedia = availableMediaList[randomNumber]
            let { fileId, type, sender, _id } = selectedMedia
            console.log( targetId + ' ready to send ' + _id)

            let sendedMessageInfo = null
            switch (type) {
                case 'image':
                    sendedMessageInfo = await bot.telegram.sendPhoto(targetId, fileId, caption)
                    break;
                case 'video':
                    sendedMessageInfo = await bot.telegram.sendVideo(targetId, fileId, caption)
                    break;
                case 'animation':
                    sendedMessageInfo = await bot.telegram.sendAnimation(targetId, fileId, caption)
                    break;
            }
            console.log( targetId + ' sendComplete')

            if (subscriberInfo.type === 'private') { resolve(); return; }

            let pollMessage = await bot.telegram.sendPoll(targetId, 
                                        'Score (1 Worest , 5 Best)', 
                                        ['1','2','3','4','5']
                                    )
            
            let newVote = new VotingModel({
                messageId: sendedMessageInfo.message_id, // messageId
                pollMessageId: pollMessage.message_id,
                groupId: subscriberInfo._id,
                bySender: sender,
                fileId,
                fileType: type,
                status: 1,
                targetGroup: targetId
            })
            await newVote.save()
            await MediaModel.findByIdAndUpdate(_id, { $push: { sendedTo: subscriberInfo._id } })
            
            resolve();

        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

let scheduleSendMedia = async (bot) => {
    let subscriberList = await SubscriptionListModel.find({})
    console.log(subscriberList)

    for (let item of subscriberList) {
        try {
            console.log('send media to ' + item.type + ', ' + item.subscriberId)
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
    // list.forEach((item, idx)=>{
    //     list[idx].average = item.score/item.votedGroupMember.length
    // })
    // list.sort(()=>{

    // })
    let top3List = list.splice(0, 3)
    let subscriptionList = await SubscriptionListModel.find({})

    try{
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
            await bot.telegram.sendMessage(targetId, ' Media remains:  ' + await stockCheck(targetId)) 
        }
    } catch (err) {
        console.error(err)
    }
    
}

let stopAllPoll = async (bot) => {
    let currentVoteList = await VotingModel.find({status: 1})

    try {
        for(let cv of currentVoteList){
            let pollInfo = await bot.telegram.stopPoll(cv.targetGroup, cv.pollMessageId)
            let score = 0
            let voterCount = 0
    
            for(let item of pollInfo.options){
                score += Number(item.text) * Number(item.voter_count)
                voterCount += Number(item.voter_count)
            }
    
            await bot.telegram.deleteMessage(cv.targetGroup, cv.pollMessageId)
    
            let oldCaption = 'Total Score: ' + score + ', Voted count: ' + voterCount 
            await bot.telegram.editMessageCaption(cv.targetGroup, cv.messageId, '', oldCaption)
            await VotingModel.findByIdAndUpdate(cv._id, { $set: { status: 0 , score, voterCount } }, { new: true })
        }
    } catch (err){
        console.error(err)
    }
}

module.exports = {
    sendMedia,
    scheduleSendMedia,
    reset,
    stockCheck,
    weeklyReport,
    stopAllPoll
}