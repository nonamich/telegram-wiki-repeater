import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import {
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
  WikiArticle,
} from '~/modules/wiki/types';

import { TelegramImages } from './telegram.images';
import { ChatId } from './telegram.types';
import { TelegramViews } from './views/telegram.view';

@Injectable()
export class TelegramSender {
  constructor(
    @InjectBot() readonly bot: Telegraf,
    readonly views: TelegramViews,
    readonly images: TelegramImages,
  ) {}

  async sendFeaturedArticle(chatId: ChatId, article: WikiArticle) {
    const html = await this.views.renderFeaturedArticle({ article });
    const image = await this.images.getImageURLByArticle(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedImage(chatId: ChatId, image: WikiFeaturedImage) {
    const caption = await this.views.renderFeaturedImage({ image });
    const imageURL = await this.images.getResizedURL(image.thumbnail);

    await this.sendPost(chatId, caption, imageURL);
  }

  async sendNews(chatId: ChatId, news: WikiNews) {
    const html = await this.views.renderNews({ news });
    const image = await this.images.getFirstImageFromArticles(news.links);

    await this.sendPost(chatId, html, image);
  }

  async sendOnThisDay(chatId: ChatId, event: WikiOnThisDay) {
    const html = await this.views.renderOnThisDay({ event });
    const image = await this.images.getFirstImageFromArticles(event.pages);

    await this.sendPost(chatId, html, image);
  }

  async sendPost(chatId: ChatId, html: string, media?: string) {
    const extra = this.getDefaultExtra();

    if (media) {
      await this.bot.telegram.sendPhoto(chatId, media, {
        ...extra,
        caption: html,
      });
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }
  }

  getDefaultExtra() {
    return {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;
  }
}
