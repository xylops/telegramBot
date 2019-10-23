const { reset, pickOneMedia, sendMedia } = require('../utils')
const { SubscriptionListModel } = require('../models')
const fs = require('fs')

let roleCheck = (ctx, next) => {
    if(ctx.message.chat.first_name !== process.env.rootAdmin) { 
        ctx.reply('Permission Decline')
        return;
    } else {
        next()
    }
}

module.exports = function(bot) {
    bot.command('subscribe',  async ({reply}) => {
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
    bot.command('reset', roleCheck, async ({reply}) => {
        try {
            await reset()
            reply('Image Reset Complete');
        } catch (err){
            reply('Image Reset Fail');
        }
    });
    bot.command('sendMedia', roleCheck, async (ctx) => {
        try {
            await sendMedia(bot, ctx.message.chat.id)
        } catch (err){
            console.log(err)
            await ctx.reply('Sent Photo Fail');
        }
    });
};