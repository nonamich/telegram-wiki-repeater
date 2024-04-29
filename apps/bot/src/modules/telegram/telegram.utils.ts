import { InputMediaPhoto } from 'telegraf/types';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { Utils } from '@repo/shared';

import { WikiArticle, WikiImage } from '../wiki/interfaces';
import { MAX_IMAGES_ON_GROUP } from './telegram.constants';

export class TelegramUtils {
  static getArticleImage(article: WikiArticle) {
    const images = [article.originalimage, article.thumbnail].filter(
      (image): image is WikiImage => !!image,
    );
    const maxW = 3000;
    const maxH = 3000;
    const minW = 200;
    const minH = 200;

    return images.find((image) => {
      return (
        Utils.isBetween(image.width, minW, maxW) &&
        Utils.isBetween(image.height, minH, maxH)
      );
    });
  }

  static getMediaGroup(articles: WikiArticle[]) {
    const images = articles
      .map(TelegramUtils.getArticleImage)
      .filter(Utils.truthy)
      .slice(0, MAX_IMAGES_ON_GROUP);

    return images.map((image) => {
      const inputMedia: InputMediaPhoto = {
        type: 'photo',
        media: {
          url: image.source,
        },
      };

      return inputMedia;
    });
  }

  static getDefaultExtra() {
    const extra = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;

    return extra;
  }
}
