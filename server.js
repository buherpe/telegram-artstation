const {telegram} = require('./util/telegram');
const {logger} = require('./util/logger');
const {util} = require('./util/util');

(async () => {
  logger.info("бот был запущен на сервере");
  let scheduledPosting = util.setRandomInterval(() => util.scheduledPostSending());
  telegram.command('stop', (ctx) => {
    if (scheduledPosting.scheduledPostingActive) {
      scheduledPosting.clear();
      scheduledPosting.scheduledPostingActive = false;
    } else {
      logger.warn("отправка постов уже остановлена")
    }
  })
  telegram.command('start', (ctx) => {
    if (!scheduledPosting.scheduledPostingActive) {
      scheduledPosting = util.setRandomInterval(() => util.scheduledPostSending());
    } else {
      logger.warn("отправка постов уже запущенна")
    }
  })
  telegram.on('text', (ctx, next) => {
    ctx.deleteMessage();
  });
  await telegram.launch();
})();

