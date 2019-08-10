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
            bot.sendMessage(id, 'Subscribe Successful');
        } catch(err){
            console.log(err)
            bot.sendMessage(id, 'Subscribe Fail');
        }
    });
};