require('dotenv').config();

const {Telegraf} = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/** проверка на админа */
bot.use(async (ctx, next) => {
  if (ctx.message.chat) {
    // console.time(`Processing update ${ctx.update.update_id}`);
    if (ctx.message.chat.id == process.env.TELEGRAM_USER_ID) {
      await next() // runs next middleware
    } else {
      ctx.deleteMessage();
      ctx.sendMessage("you can not use this bot. author of this bot is https://t.me/thatoranzhevyy");
    }
  }
  // runs after next middleware finishes
  // console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.sendLogMessage = (message) => bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, message);
bot.sendPrivatePost = (data) => bot.telegram.sendMediaGroup(process.env.TELEGRAM_USER_ID, data);
bot.sendPrivateMassage = (msg) => bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, msg);
bot.sendPost = (data) => bot.telegram.sendMediaGroup(process.env.TELEGRAM_GROUP_ID, data);

exports.telegram = bot;
