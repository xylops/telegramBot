const { reset, sendPhoto } = require('../utils')
const { SubscriptionListModel } = require('../models')
const fs = require('fs')


module.exports = function(bot) {
    bot.command('subscribe', async ({reply}) => {
        let { id , first_name, type } = ctx.message.chat
        try {
            let newsubScriptionList = new SubscriptionListModel({
                subscriberId: id,
                name: first_name,
                type
            })
            await newsubScriptionList.save();
            await reply('全公司最大的J圖機械人, 上線啦!!!');
        } catch(err){
            console.log(err)
            reply('Subscribe Fail')
        }
    })

    bot.command('test', (ctx) => {
        console.log(ctx)
    })
    bot.command('reset', async ({reply}) => {
        try {
            await reset()
            reply('Image Reset Complete');
        } catch (err){
            reply('Image Reset Fail');
        }
    });
    bot.command('sendPhoto', async ({replyWithPhoto, reply}) => {
        try {
            await sendPhoto(replyWithPhoto, reply)
        } catch (err){
            console.log(err)
            await reply('Sent Photo Fail');
        }
    });
};