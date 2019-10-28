const { reset, sendMedia, stockCheck, weeklyReport } = require('../utils')
const { SubscriptionListModel, MediaModel } = require('../models')

let roleCheck = (ctx, next) => {
    if (ctx.message.chat.first_name !== process.env.rootAdmin) {
        ctx.reply('Permission Decline')
        return;
    } else {
        next()
    }
}

module.exports = function (bot) {
    bot.command('subscribe', async (ctx) => {
        let { id, first_name, type } = ctx.message.chat
        try {
            // add logic for resubscribe
            let newsubScriptionList = new SubscriptionListModel({
                subscriberId: id,
                name: first_name,
                type
            })
            await newsubScriptionList.save();
            await ctx.reply('全公司最大的J圖機械人, 上線啦!!!');
        } catch (err) {
            console.log(err)
            ctx.reply('Subscribe Fail')
        }
    })
    bot.command('reset', roleCheck, async ({ reply }) => {
        try {
            await reset()
            reply('Reset Complete');
        } catch (err) {
            reply('Reset Fail');
        }
    });
    bot.command('sendMedia', roleCheck, async (ctx) => {
        try {
            await sendMedia(bot, ctx.message.chat.id, 'SendMedia Photo')
        } catch (err) {
            console.log(err)
            await ctx.reply('Sent Photo Fail - ' + err);
        }
    });
    bot.command('stock_check', roleCheck, async (ctx) => {
        await ctx.reply(' Media remains:  ' + await stockCheck(ctx.message.chat.id));
    })
    bot.command('test', roleCheck, async (ctx) => {
        // for testing
        weeklyReport()
    });
};