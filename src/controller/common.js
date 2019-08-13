module.exports = function(bot) {
    // bot.on('message', (msg) => {
    //     const chatId = msg.chat.id;
    //     console.log(msg)
    //     bot.sendMessage(chatId, 'Received your message : ' + msg.text);
    // });
    bot.on("polling_error", (err) => console.log(err));
};