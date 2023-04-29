const minMinuteDelay = 2; // Минимально время в минутах рандома
const maxMinuteDelay = 5; // Максимальное время в минутах рандома

const {logger} = require('./logger');

const util = {
  scheduled_post_sending: true,
  /**
   * Функция старта функции
   * */
  setRandomInterval: (intervalFunction) => {
    const minDelay = minMinuteDelay * 60000;
    const maxDelay = maxMinuteDelay * 60000;
    const nowHour = new Date().getHours();
    let timeout;
    const timeConversion = (millisecond) => {
      const seconds = (millisecond / 1000).toFixed(1);
      const minutes = (millisecond / (1000 * 60)).toFixed(1);
      const hours = (millisecond / (1000 * 60 * 60)).toFixed(1);
      const days = (millisecond / (1000 * 60 * 60 * 24)).toFixed(1);
      if (seconds < 60) return seconds + " сек";
      else if (minutes < 60) return minutes + " мин";
      else if (hours < 24) return hours + " ч";
      else return days + " д";
    }
    const runInterval = (_delay) => {
      const timeoutFunction = () => {
        intervalFunction();
        runInterval();
      };

      let delay;
      delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      logger.info(`следющий пост через: ${timeConversion(delay)}`)

      timeout = setTimeout(timeoutFunction, delay);
    };
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0, 0);
    const delay = next.getTime() - now.getTime()

    runInterval(delay);

    return {
      clear() {
        this.scheduled_post_sending = false;
        logger.info(`отправка постов остановленна`);
        clearTimeout(timeout)
      },

    };
  },
  scheduledPostSending() {
    logger.info("test")
  }
}

exports.util = util;
