import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/types';

import {
  WikiMostReadArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
  WikiImage,
  WikiArticle,
} from '~/modules/wiki/interfaces';

import { TelegramUtils } from './telegram.utils';
import { TelegramViews } from './views/telegram.view';
import { ArticleProps } from './views/templates';

@Injectable()
export class TelegramSender {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly views: TelegramViews,
  ) {}

  async sendMostReadArticle(chatId: number, article: WikiMostReadArticle) {
    await this.sendArticle(chatId, {
      article,
      beforeTitle: '⚡',
      tags: ['mostread'],
    });
  }

  async sendFeaturedArticle(chatId: number, article: WikiArticle) {
    await this.sendArticle(chatId, {
      article,
      beforeTitle: '⭐️',
      tags: ['tfa'],
    });
  }

  async sendFeaturedImage(chatId: number, image: WikiFeaturedImage) {
    const caption = this.views.renderFeaturedImage({ image });

    await this.sendPost(chatId, caption, image.thumbnail.source);
  }

  async sendNews(chatId: number, news: WikiNews) {
    const html = this.views.renderNews({ news });
    const articleWithImage = news.links.find(TelegramUtils.getArticleImage);
    let image: WikiImage | undefined;

    if (articleWithImage) {
      image = TelegramUtils.getArticleImage(articleWithImage);
    }

    await this.sendPost(chatId, html, image?.source);
  }

  async sendOnThisDay(chatId: number, event: WikiOnThisDay) {
    const html = this.views.renderOnThisDay({ event });
    const mainArticle = event.pages.at(0)!;
    const image = TelegramUtils.getArticleImage(mainArticle);

    await this.sendPost(chatId, html, image?.source);
  }

  private async sendArticle(chatId: number, props: ArticleProps) {
    const html = this.views.renderArticle(props);
    const image = TelegramUtils.getArticleImage(props.article);

    await this.sendPost(chatId, html, image?.source);
  }

  async sendPost(
    chatId: number,
    html: string,
    media?: string | InputMediaPhoto[],
  ) {
    const extra = TelegramUtils.getDefaultExtra();

    if (typeof media === 'string') {
      await this.bot.telegram.sendPhoto(chatId, media, {
        ...extra,
        caption: html,
      });
    } else if (media?.length) {
      media[0].caption = html;
      media[0].parse_mode = extra.parse_mode;

      await this.bot.telegram.sendMediaGroup(chatId, media, {
        disable_notification: extra.disable_notification,
      });
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }
  }
}
