const {telegram} = require('./util/telegram');
const {logger} = require('./util/logger');
const {util} = require('./util/util');

(async () => {
  logger.info("бот был запущен на сервере");
  scheduledPosting = util.setRandomInterval(() => util.scheduledPostSending());
  telegram.command('stop', (ctx) => {
    scheduledPosting.clear();
  })
  telegram.command('start', (ctx) => {
    scheduledPosting = util.setRandomInterval(() => util.scheduledPostSending());
  })
  telegram.on('text', (ctx, next) => {
    ctx.deleteMessage();
  });
  await telegram.launch();
})();

