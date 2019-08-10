const { ImageModel } = require('../models')

module.exports = function(bot) {
    // upload image
    bot.on('photo', async (msg) => {
        console.log(msg.chat.type)
        if(msg.chat.type !== 'private') { return }
        const chatId = msg.chat.id;
        let fileId = msg.photo[0].file_id
        try{
            let sender = msg.chat.first_name
            let newImage = new ImageModel({
                fileId,
                sender
            })
            await newImage.save()
            bot.sendMessage(chatId, 'Received your Photo : ' + fileId);
        } catch (err) {
            bot.sendMessage(chatId, 'Image upload fail');
        }
    });
};