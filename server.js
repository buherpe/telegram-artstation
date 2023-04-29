const {telegram} = require('./util/telegram');
const {logger} = require('./util/logger');


(async () => {
  logger.info("bot started on server")
  await telegram.launch();
})();

