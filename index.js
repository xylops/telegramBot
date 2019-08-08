require('dotenv').config()
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

const TelegramBot = require('node-telegram-bot-api');

// const port = process.env.port || 3000;
const token = process.env.TelegramToken;
const bot = new TelegramBot(token, {polling: true});

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message : ' + msg.text);
});