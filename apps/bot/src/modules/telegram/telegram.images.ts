import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ImagesService } from '~/modules/images/images.service';
import { WikiImage, WikiArticle } from '~/modules/wiki/types';

import {
  TELEGRAM_BLACK_LIST_OF_IMAGE,
  TELEGRAM_IMAGE_SIZE,
  TELEGRAM_MAX_IMAGE_BYTES,
} from './telegram.constants';

@Injectable()
export class TelegramImages {
  constructor(
    readonly imagesService: ImagesService,
    readonly http: HttpService,
  ) {}

  async getResizedURL(url: string) {
    const { headers } = await this.http.axiosRef.head(url);
    const contentLength = Number(headers['content-length']);

    if (contentLength >= TELEGRAM_MAX_IMAGE_BYTES) {
      return this.imagesService.getResizedProxyURL(url, TELEGRAM_IMAGE_SIZE);
    }

    return url;
  }

  async getImageURLByArticle({ originalimage: image }: WikiArticle) {
    if (!image || this.isInBackList(image)) {
      return;
    }

    return await this.getResizedURL(image.source);
  }

  isInBackList(image: WikiImage) {
    return TELEGRAM_BLACK_LIST_OF_IMAGE.some((word) =>
      new RegExp(word, 'i').test(image.source),
    );
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
