const { reset, sendMedia, stockCheck, weeklyReport, scheduleSendMedia } = require('../utils')
const { SubscriptionListModel, MediaModel, VotingModel } = require('../models')
const _ = require('lodash')

let roleCheck = (ctx, next) => {
    if (ctx.message.from.id !== 356151966) {
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
            if(id == 742992591){ throw ('') }
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
    bot.command('getChatId', roleCheck, async (ctx)=>{
        await ctx.reply(ctx.message.chat.id)
    })
    bot.command('stock_check', async (ctx) => {
        await ctx.reply(' Media remains:  ' + await stockCheck(ctx.message.chat.id));
    })
    
    bot.command('startPoll', roleCheck, async (ctx) => {
        // for testing
        // let pollInfo = await bot.telegram.sendPoll(-396973916, 'score', ['1', '2'])
        // console.log(pollInfo)
        // { 
        //     message_id: 1138,
        //     from:
        //      { id: 906676967,
        //        is_bot: true,
        //        first_name: 'Tranquility_UAT',
        //        username: 'TarlunUAT_bot' },
        //     chat:
        //      { id: -396973916,
        //        title: 'Uat',
        //        type: 'group',
        //        all_members_are_administrators: true },
        //     date: 1575127154,
        //     poll:
        //      { id: '6275789913514311683',
        //        question: 'score',
        //        options: [ [Object], [Object] ],
        //        is_closed: false } 
        // }
    });
    bot.command('stopPoll', roleCheck, async (ctx) => {
        // for testing
        // let pollInfo = await bot.telegram.stopPoll(-396973916, 1138)
        // console.log(pollInfo)
        // { 
        //     id: '6275789913514311683',
        //     question: 'score',
        //     options:
        //     [ { text: '1', voter_count: 0 }, { text: '2', voter_count: 0 } ],
        //     is_closed: true 
        // }
        // await VotingModel.updateMany({status: 1}, {status: 0})

    });
    bot.command('test', roleCheck, async (ctx) => {
        // for testing
        // ctx.stopPoll()
        // await VotingModel.updateMany({status: 1}, {status: 0})
        console.log(123123)
    });
    bot.command('help', async (ctx) => {
        await ctx.reply('help command is request by david');
    });
};