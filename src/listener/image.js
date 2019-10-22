const { ImageModel } = require('../models')

module.exports = function(bot) {
    // upload image
    bot.on('photo', async ({message, reply}) => {
        if(message.chat.type !== 'private') { return }
        let fileId = message.photo[message.photo.length -1].file_id
        try{
            let newImage = new ImageModel({
                fileId,
                sender: message.chat.first_name
            })
            await newImage.save()
            reply('Received your Photo : ' + fileId);
        } catch (err) {
            reply('Image upload fail');
        }
    });
};