import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import {
  WikiMostReadArticle,
  WikiFeaturedArticle,
  WikiFeaturedImage,
  WikiNews,
  WikiOnThisDay,
} from '~/modules/wiki/interfaces';

import { TelegramSendArticleList } from './interfaces/telegram.interface';
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
      icon: '⚡',
      tags: ['mostread'],
    });
  }

  async sendFeaturedArticle(chatId: number, article: WikiFeaturedArticle) {
    await this.sendArticle(chatId, {
      article,
      icon: '⭐️',
      tags: ['tfa'],
    });
  }

  async sendFeaturedImage(chatId: number, image: WikiFeaturedImage) {
    const caption = this.views.renderFeaturedImage({ image });

    await this.sendPost(chatId, caption, image.thumbnail.source);
  }

  async sendNews(chatId: number, news: WikiNews[]) {
    await this.sendList({
      chatId,
      list: news.map(({ story }) => story),
      title: `🆕 In the news:`,
      tags: ['news'],
    });
  }

  // async sendOnThisDay(chatId: number, { pages, text }: WikiOnThisDay) {
  //   await this.sendList({
  //     chatId,
  //     articles: pages,
  //     title: text,
  //     icon: '🏺',
  //     tags: ['on_this_day'],
  //   });
  // }

  private async sendList({
    chatId,
    list,
    title,
    tags,
  }: TelegramSendArticleList) {
    const html = this.views.renderArticleList({
      list,
      title,
      tags,
    });

    await this.bot.telegram.sendMessage(
      chatId,
      html,
      TelegramUtils.getDefaultExtra(),
    );
  }

  private async sendArticle(chatId: number, props: ArticleProps) {
    const html = this.views.renderArticle(props);
    const image = TelegramUtils.getArticleImage(props.article);

    await this.sendPost(chatId, html, image?.source);
  }

  async sendPost(chatId: number, html: string, imageURL?: string) {
    const extra = TelegramUtils.getDefaultExtra();

    if (imageURL) {
      await this.bot.telegram.sendPhoto(
        chatId,
        {
          url: imageURL,
        },
        {
          ...extra,
          caption: html,
        },
      );
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }
  }
}
