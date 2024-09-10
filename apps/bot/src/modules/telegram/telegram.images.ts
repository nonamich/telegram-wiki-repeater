import path from 'node:path';

import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { ImagesService } from '~/modules/images/images.service';
import { WikiImage, WikiArticle } from '~/modules/wiki/types';

import { ImageExceptionForbiddenResize } from '../images/exceptions/image.exception.resize-forbidden';
import {
  TELEGRAM_BLACK_LIST_OF_IMAGE,
  TELEGRAM_PREFER_IMAGE_WIDTH,
  TELEGRAM_MAX_IMAGE_DIMENSIONS,
  TELEGRAM_MAX_IMAGE_BYTES,
} from './telegram.constants';

@Injectable()
export class TelegramImages {
  TRANSFORM_EXP = ['svg', 'tif'];

  constructor(readonly imagesService: ImagesService) {}

  async getResizedURL(image: WikiImage) {
    const ext = path.parse(image.source).ext.replace('.', '');
    const contentLength = await this.imagesService.getContentLength(
      image.source,
    );

    if (
      this.TRANSFORM_EXP.includes(ext) ||
      contentLength >= TELEGRAM_MAX_IMAGE_BYTES ||
      image.width >= TELEGRAM_MAX_IMAGE_DIMENSIONS ||
      image.height >= TELEGRAM_MAX_IMAGE_DIMENSIONS
    ) {
      return await this.imagesService.getResizeURL(
        image.source,
        TELEGRAM_PREFER_IMAGE_WIDTH,
      );
    }

    return image.source;
  }

  async getImageURLByArticle({ originalimage, thumbnail }: WikiArticle) {
    if (!originalimage || !thumbnail || this.isInBlackList(originalimage)) {
      return;
    }

    const images = [originalimage, thumbnail];

    for (const image of images) {
      try {
        return await this.getResizedURL(image);
      } catch (error) {
        if (
          error instanceof ImageExceptionForbiddenResize ||
          axios.isAxiosError(error)
        ) {
          continue;
        }

        throw error;
      }
    }
  }

  isInBlackList(image: WikiImage) {
    const url = decodeURI(image.source);

    return TELEGRAM_BLACK_LIST_OF_IMAGE.some((word) => {
      return new RegExp(word, 'i').test(url);
    });
  }

  async getFirstImageFromArticles(articles: WikiArticle[]) {
    for (const article of articles) {
      const url = await this.getImageURLByArticle(article);

      if (!url) {
        continue;
      }

      return {
        url,
        pageId: article.pageid,
      };
    }
  }
}
