const { reset, sendPhoto } = require('../utils')
const { SubscriptionListModel } = require('../models')

module.exports = function(bot) {
    bot.onText(/\/subscribe/, async (msg, match) => {
        const { id, first_name, type } = msg.chat
        try {
            let newsubScriptionList = new SubscriptionListModel({
                subscriberId: id,
                name: first_name,
                type
            })
            await newsubScriptionList.save();
            await bot.sendMessage(id, 'Subscribe Successful');
        } catch(err){
            console.log(err)
            await bot.sendMessage(id, 'Subscribe Fail');
        }
    });
    bot.onText(/\/reset/, async (msg) => {
        const { id } = msg.chat
        try {
            await reset(bot)
            await bot.sendMessage(id, 'Image Reset Complete');
        } catch (err){
            await bot.sendMessage(id, 'Image Reset Fail');
        }
    });
    bot.onText(/\/sendPhoto/, async () => {
        try {
            await sendPhoto(bot)
        } catch (err){
            await bot.sendMessage(id, 'Sent Photo Fail');
        }
    });
};