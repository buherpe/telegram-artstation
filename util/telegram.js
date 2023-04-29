require('dotenv').config();

const {Telegraf} = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

/** проверка на админа */
bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  if (ctx.message.chat.id == process.env.TELEGRAM_USER_ID) {
    await next() // runs next middleware
  } else {
    ctx.sendMessage("Бот работает только от админа. Ты не админ. ЛОХ! ХАХАХХА")
  }
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.sendLogMessage = (message) => bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, message);

exports.telegram = bot;
