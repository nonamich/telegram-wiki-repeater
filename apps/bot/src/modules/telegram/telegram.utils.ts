import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { Utils } from '@repo/shared';

import { WikiArticle, WikiImage } from '../wiki/types';
import {
  TELEGRAM_MAX_IMAGE_SIZE,
  TELEGRAM_MIN_IMAGE_SIZE,
} from './telegram.constants';

const BLACK_LIST_OF_IMAGE =
  /Путін|Путин|Putin|Flag_of_Russia|Flag_of_the_Soviet|Russian_Imperial_Army|Flag_of_Germany_\(1935–1945\)/i;

export abstract class TelegramUtils {
  static getArticleImage(article: WikiArticle) {
    const images = [article.originalimage, article.thumbnail].filter(
      (image): image is WikiImage => !!image,
    );

    return images.find(TelegramUtils.isValidImage);
  }

  static isValidImage(image: WikiImage) {
    return (
      !BLACK_LIST_OF_IMAGE.test(image.source) &&
      Utils.isBetween(
        image.width,
        TELEGRAM_MIN_IMAGE_SIZE,
        TELEGRAM_MAX_IMAGE_SIZE,
      ) &&
      Utils.isBetween(
        image.height,
        TELEGRAM_MIN_IMAGE_SIZE,
        TELEGRAM_MAX_IMAGE_SIZE,
      )
    );
  }

  static getDefaultExtra() {
    const extra = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;

    return extra;
  }
}
