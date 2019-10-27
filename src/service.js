const Telegraf = require('telegraf')
const mongoose = require('mongoose')
const { isEmpty } = require('lodash')
const CronJob = require('cron').CronJob;
// const { scheduleSendMedia } = require('./utils')

let connectMongoose = () => {
    mongoose.connect(
        process.env.DB_URL, 
        { useNewUrlParser: true },
        ()=>{
            console.log('Connected to Mongodb Tranquility' ) 
            startBot()
        }
    );
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false)
}

let startBot = () => {
    const token = process.env.TelegramToken;
    const bot = new Telegraf(token)
    require('./listener')(bot)
    bot.catch((err) => {
        console.log('Ooops', err)
    })
    bot.launch()
    // startCronJob(bot)
}

let startCronJob = (bot) => {
    // let cronExp = '0 10 * * 1-5'  //weekday 10:00 am
    // let cronExp = process.env.cronExp
    // if( isEmpty(cronExp) ){ return }
    // new CronJob(cronExp, () => {
    //     scheduleSendMedia(bot)
    // }, null, true, 'Asia/Hong_Kong');
}

module.exports = {
    connectMongoose
}