import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import {
  WikiMostReadArticle,
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

  async sendMostReadArticle(chatId: ChatId, article: WikiMostReadArticle) {
    const html = await this.views.renderMostRead({ article });
    const image = await this.images.getImageURLByArticle(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedArticle(chatId: ChatId, article: WikiArticle) {
    const html = await this.views.renderFeaturedArticle({ article });
    const image = await this.images.getImageURLByArticle(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedImage(chatId: ChatId, image: WikiFeaturedImage) {
    const caption = await this.views.renderFeaturedImage({ image });

    await this.sendPost(chatId, caption, image.thumbnail.source);
  }

  async sendNews(chatId: ChatId, news: WikiNews) {
    const html = await this.views.renderNews({ news });
    const image = await this.images.getFirstImageFromArticles(news.links);

    await this.sendPost(chatId, html, image);
  }

  deleteUselessPage({ pages, year }: WikiOnThisDay) {
    const findIndex = pages.findIndex(({ titles: { normalized: title } }) => {
      return new RegExp(`^${year} `).test(title);
    });

    if (findIndex === -1) {
      return;
    }

    pages.splice(findIndex, 1);
  }

  async sendOnThisDay(chatId: ChatId, event: WikiOnThisDay) {
    this.deleteUselessPage(event);

    const html = await this.views.renderOnThisDay({ event });
    const image = await this.images.getFirstImageFromArticles(event.pages);

    await this.sendPost(chatId, html, image);
  }

  async sendPost(chatId: ChatId, html: string, media?: string) {
    const extra = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;

    if (media) {
      await this.bot.telegram.sendPhoto(chatId, media, {
        ...extra,
        caption: html,
      });
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }
  }
}
