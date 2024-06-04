import { Utils } from '@repo/shared';

import {
  TELEGRAM_TURN_OFF_HOUR,
  TELEGRAM_TURN_ON_HOUR,
} from './telegram.constants';

export class TelegramShowTime {
  static get hour() {
    return new Date().getHours();
  }

  static isFeaturedImage() {
    return this.hour >= 12;
  }

  static isFeaturedArticle() {
    return this.hour >= 15;
  }

  static isTime() {
    return Utils.isBetween(
      this.hour,
      TELEGRAM_TURN_ON_HOUR,
      TELEGRAM_TURN_OFF_HOUR,
    );
  }
}
