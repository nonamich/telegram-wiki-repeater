import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { Utils } from '@repo/shared';

import { WikiArticle, WikiImage } from '../wiki/interfaces';
import { MAX_IMAGE_SIZE, MIN_IMAGE_SIZE } from './telegram.constants';

export class TelegramUtils {
  static getArticleImage(article: WikiArticle) {
    const images = [article.originalimage, article.thumbnail].filter(
      (image): image is WikiImage => !!image,
    );

    return images.find(TelegramUtils.isValidImage);
  }

  static isValidImage(image: WikiImage) {
    return (
      Utils.isBetween(image.width, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE) &&
      Utils.isBetween(image.height, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE)
    );
  }

  static getDefaultExtra() {
    const extra = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      disable_notification: true,
    } satisfies ExtraReplyMessage;

    return extra;
  }
}
