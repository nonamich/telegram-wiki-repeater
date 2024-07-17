import path from 'node:path';

import { Injectable } from '@nestjs/common';

import axios, { Axios, AxiosHeaders } from 'axios';

import { ImagesService } from '~/modules/images/images.service';
import { WikiImage, WikiArticle } from '~/modules/wiki/types';

import { ImageExceptionResizeForbidden } from '../images/exceptions/image.exception.resize-forbidden';
import {
  TELEGRAM_BLACK_LIST_OF_IMAGE,
  TELEGRAM_IMAGE_SIZE,
  TELEGRAM_MAX_IMAGE_BYTES,
} from './telegram.constants';

@Injectable()
export class TelegramImages {
  TRANSFORM_EXP = ['svg', 'tif'];

  constructor(readonly imagesService: ImagesService) {}

  async getResizedURL(url: string) {
    const ext = path.parse(url).ext.replace('.', '');
    const contentLength = await this.imagesService.getContentLength(url);

    if (
      this.TRANSFORM_EXP.includes(ext) ||
      contentLength >= TELEGRAM_MAX_IMAGE_BYTES
    ) {
      return await this.imagesService.getResizedProxyURL(
        url,
        TELEGRAM_IMAGE_SIZE,
      );
    }

    return url;
  }

  async getImageURLByArticle({ originalimage, thumbnail }: WikiArticle) {
    if (!originalimage || !thumbnail || this.isInBlackList(originalimage)) {
      return;
    }

    const images = [originalimage, thumbnail];

    for (const image of images) {
      try {
        return await this.getResizedURL(image.source);
      } catch (error) {
        if (
          error instanceof ImageExceptionResizeForbidden ||
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
      const image = await this.getImageURLByArticle(article);

      if (!image) {
        continue;
      }

      return image;
    }
  }
}
