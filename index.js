require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose')
const CronJob = require('cron').CronJob;
const { sendPhoto } = require('./utils')

mongoose.connect(
    process.env.DB_URL, 
    { useNewUrlParser: true },
    ()=>{ 
        console.log('Connected to Mongodb Tranquility' ) 
        const token = process.env.TelegramToken;
        const bot = new TelegramBot(token, {polling: true});
        require('./controller')(bot)

        // let cronExp = '0 10 * * 1-5'  //weekday 10:00 am
        let cronExp = '1 * * * * *'   //every min
        new CronJob(cronExp, function() {
            sendPhoto(bot)
        }, null, true, 'Asia/Hong_Kong');
    }
);
mongoose.set('useCreateIndex', true);