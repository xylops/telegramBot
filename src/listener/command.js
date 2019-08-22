const { reset, sendPhoto } = require('../utils')
const { SubscriptionListModel } = require('../models')
const fs = require('fs')


module.exports = function(bot) {
    const sayYoMiddleware = ({ reply }, next) => next()
    bot.hears('Hey', sayYoMiddleware, (ctx) => {
        fs.createWriteStream('./temp/temp.txt', ctx)
        console.log(ctx)
        return ctx.replyWithMarkdown(`_Hey counter:_ 123123`)
    })

    bot.hears(/reverse (.+)/, ({ match, reply }) => reply(match[1].split('').reverse().join('')))

    bot.command('cat', (ctx) => console.log(ctx.update.message))

    // bot.onText(/\/subscribe/, async (msg, match) => {
    //     const { id, first_name, type } = msg.chat
    //     try {
    //         let newsubScriptionList = new SubscriptionListModel({
    //             subscriberId: id,
    //             name: first_name,
    //             type
    //         })
    //         await newsubScriptionList.save();
    //         await bot.sendMessage(id, '全公司最大的J圖機械人, 上線啦!!!');
    //     } catch(err){
    //         console.log(err)
    //         await bot.sendMessage(id, 'Subscribe Fail');
    //     }
    // });
    // bot.onText(/\/reset/, async (msg) => {
    //     const { id } = msg.chat
    //     try {
    //         await reset(bot)
    //         await bot.sendMessage(id, 'Image Reset Complete');
    //     } catch (err){
    //         await bot.sendMessage(id, 'Image Reset Fail');
    //     }
    // });
    // bot.onText(/\/sendPhoto/, async () => {
    //     try {
    //         await sendPhoto(bot)
    //     } catch (err){
    //         await bot.sendMessage(id, 'Sent Photo Fail');
    //     }
    // });
};