import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { ImagesService } from '~/modules/images/images.service';
import {
  WikiMostReadArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
  WikiImage,
  WikiArticle,
} from '~/modules/wiki/types';

import {
  TELEGRAM_BLACK_LIST_OF_IMAGE,
  TELEGRAM_MAX_IMAGE_SIZE,
} from './telegram.constants';
import { ChatId } from './telegram.types';
import { TelegramUtils } from './telegram.utils';
import { TelegramViews } from './views/telegram.view';

@Injectable()
export class TelegramSender {
  constructor(
    @InjectBot() readonly bot: Telegraf,
    readonly views: TelegramViews,
    readonly imagesService: ImagesService,
  ) {}

  getArticleImage(article: WikiArticle) {
    return article.originalimage;
  }

  isValidImage(image: WikiImage) {
    return !TELEGRAM_BLACK_LIST_OF_IMAGE.some((word) =>
      new RegExp(word, 'i').test(image.source),
    );
  }

  async sendMostReadArticle(chatId: ChatId, article: WikiMostReadArticle) {
    const html = await this.views.renderMostRead({ article });
    const image = this.getArticleImage(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedArticle(chatId: ChatId, article: WikiArticle) {
    const html = await this.views.renderFeaturedArticle({ article });
    const image = this.getArticleImage(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedImage(chatId: ChatId, image: WikiFeaturedImage) {
    const caption = await this.views.renderFeaturedImage({ image });

    await this.sendPost(chatId, caption, image.thumbnail);
  }

  async sendNews(chatId: ChatId, news: WikiNews) {
    const html = await this.views.renderNews({ news });
    const articleWithImage = news.links.find(this.getArticleImage);
    let image: WikiImage | undefined;

    if (articleWithImage) {
      image = this.getArticleImage(articleWithImage);
    }

    await this.sendPost(chatId, html, image);
  }

  async sendOnThisDay(chatId: ChatId, event: WikiOnThisDay) {
    const html = await this.views.renderOnThisDay({ event });
    const mainArticle = event.pages.at(0)!;
    const image = this.getArticleImage(mainArticle);

    await this.sendPost(chatId, html, image);
  }

  async sendPost(chatId: ChatId, html: string, media?: WikiImage) {
    const extra = TelegramUtils.getDefaultExtra();

    if (media) {
      let url = media.source;

      if (media.width >= TELEGRAM_MAX_IMAGE_SIZE) {
        url = this.imagesService.resize(url, TELEGRAM_MAX_IMAGE_SIZE);
      }

      await this.bot.telegram.sendPhoto(chatId, url, {
        ...extra,
        caption: html,
      });
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }
  }
}
