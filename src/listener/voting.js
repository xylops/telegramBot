// const { reset, sendMedia } = require('../utils')
const { VotingModel } = require('../models')
const { isEmpty } = require('lodash')
// const { Extra, Markup } = require('telegraf');

module.exports = function (bot) {
    bot.action(['1', '2', '3', '4', '5'], async (ctx) => {
        let userInputScore = ctx.match;
        let userId = ctx.update.callback_query.from.id
        let totalGroupChatMember = await ctx.getChatMembersCount() - 1
        let messageId = ctx.update.callback_query.message.message_id

        let currentVoteInfo = await VotingModel.findOne({ messageId });

        if(isEmpty(currentVoteInfo)){
            await ctx.deleteMessage();
            return;
        }

        if (
            currentVoteInfo.status === 0
            || currentVoteInfo.votedGroupMember.length === totalGroupChatMember
        ) {
            await ctx.answerCbQuery('Vote is Closed.')
            await ctx.editMessageReplyMarkup();
            await ctx.editMessageCaption('Total Score : ' + Math.floor(currentVoteInfo.score / totalGroupChatMember))
            return;
        }

        if (currentVoteInfo.votedGroupMember.includes(userId)) {
            await ctx.answerCbQuery('You can only vote once!')
            return
        } else {
            let res = 
            await VotingModel
                .findByIdAndUpdate(
                    currentVoteInfo._id,
                    {
                        $push: { votedGroupMember: userId },
                        $inc: { score: userInputScore }
                    },
                    { new: true }
                )
            await ctx.answerCbQuery('Voted, Thanks You')

            if (res.votedGroupMember.length === totalGroupChatMember) {
                await ctx.editMessageReplyMarkup();
                await ctx.editMessageCaption('Total Score : ' + Math.floor(res.score / totalGroupChatMember))
            }
        }
    })
};