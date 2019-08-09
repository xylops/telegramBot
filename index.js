require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose')

mongoose.connect(
    process.env.DB_URL, 
    { useNewUrlParser: true },
    ()=>{ 
        console.log('Connected to Mongodb Tranquility' ) 
        const token = process.env.TelegramToken;
        const bot = new TelegramBot(token, {polling: true});
        require('./controller/message')(bot)
    }
);
mongoose.set('useCreateIndex', true);