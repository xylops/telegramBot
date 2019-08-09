const { SubscriptionListModel } = require('../models')

module.exports = function(bot) {
    bot.onText(/\/subscribe/, async (msg, match) => {
        const { id, first_name, type } = msg.chat
        try {
            let newsubScriptionList = new SubscriptionListModel({
                targetId: id,
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
    bot.on("polling_error", (err) => console.log(err));
};