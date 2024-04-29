import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/types';

import {
  WikiFeaturedArticle,
  WikiFeaturedImage,
  WikiNews,
} from '~/modules/wiki/interfaces';

import { TelegramSendArticleList } from './interfaces/telegram.interface';
import { TelegramUtils } from './telegram.utils';
import { TelegramViews } from './views/telegram.view';
import { ArticleProps } from './views/templates';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly views: TelegramViews,
  ) {}

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

  async sendNews(chatId: number, news: WikiNews) {
    await this.sendList({
      chatId,
      articles: news.links,
      title: news.story,
      icon: '🆕',
      tags: ['news'],
    });
  }

  private async sendList({
    chatId,
    articles,
    icon,
    title,
    tags,
  }: TelegramSendArticleList) {
    if (!articles.length) {
      return;
    }

    if (articles.length === 1) {
      await this.sendArticle(chatId, {
        article: articles.at(0)!,
        icon,
        tags,
      });

      return;
    }

    const mediaGroup = TelegramUtils.getMediaGroup(articles);
    const html = this.views.renderArticleList({
      articles,
      icon,
      title,
      tags,
    });

    if (mediaGroup.length) {
      await this.sendMediaGroup(chatId, mediaGroup, html);

      return;
    }

    await this.bot.telegram.sendMessage(
      chatId,
      html,
      TelegramUtils.getDefaultExtra(),
    );
  }

  private async sendMediaGroup(
    chatId: number,
    mediaGroup: InputMediaPhoto[],
    html: string,
  ) {
    const extra = TelegramUtils.getDefaultExtra();

    mediaGroup[0].caption = html;
    mediaGroup[0].parse_mode = extra.parse_mode;

    await this.bot.telegram.sendMediaGroup(chatId, mediaGroup);
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
