const { isEmpty } = require('lodash')
const { MediaModel } = require('../models')

module.exports = function (bot) {
    bot.on(['photo', 'video', 'animation'], async ({ message, reply }) => {
        
        let fileId
        let type = null

        if (!isEmpty(message.photo)) {
            fileId = message.photo[message.photo.length - 1].file_id
            type = 'image'
        } else if (!isEmpty(message.video)) {
            fileId = message.video.file_id
            type = 'video'
        } else if (!isEmpty(message.animation)) {
            fileId = message.animation.file_id
            type = 'animation'
        }
        if (isEmpty(type) || message.chat.type !== 'private') { return }
        try {
            if( message.from.id == 356151966 ){ throw('fuck you') }
            let newMedia = new MediaModel({
                fileId,
                sender: message.chat.first_name,
                senderId: message.chat.id,
                type
            })
            await newMedia.save()
            reply('Received your ' + type + ' : ' + fileId);
        } catch (err) {
            reply(isEmpty(err) ? 'Media upload fail' : err);
        }
    })
};