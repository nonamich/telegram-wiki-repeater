import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { Schemas, db, drizzle } from '@repo/db';

import {
  TgWikiImageParams,
  TgWikiArticleParams,
  SceneContext,
  TgWikiNewsParams,
  TgWikiMostReadParams,
  TgWikiListParams,
} from './interfaces';
import { TgWikiOnThisDayParams } from './interfaces/onthisday.interface';
import {
  getArticleExtra,
  getArticleHTML,
  getArticleTitleHtml,
  getDefaultExtra,
  getHTML,
  getArticleImage,
  getPreparedHtml,
} from './telegram.utils';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private bot: Telegraf<SceneContext>) {}

  getChat(chatId: number) {
    return db.query.chat.findFirst({
      where: (fields, { eq }) => eq(fields.chatId, chatId),
    });
  }

  insetOrUpdateChat(chatId: number, lang: string) {
    return db
      .insert(Schemas.chat)
      .values({
        chatId,
        lang,
      })
      .onConflictDoUpdate({
        set: {
          lang,
        },
        where: drizzle.eq(Schemas.chat.chatId, chatId),
        target: Schemas.chat.chatId,
      })
      .returning({
        chatId: Schemas.chat.chatId,
        lang: Schemas.chat.lang,
      });
  }

  sendWikiImage({ chatId, image, lang, header }: TgWikiImageParams) {
    const title = image.title.replace(/^File:|\.(png|jpg|svg)$/g, '');
    const extra = getArticleExtra(lang, image.file_page);

    return this.bot.telegram.sendPhoto(
      chatId,
      {
        url: image.thumbnail.source,
      },
      {
        ...extra,
        caption: getArticleHTML({
          title,
          lang,
          header,
          url: image.file_page,
          content: image.description.html,
          tags: ['image'],
        }),
      },
    );
  }

  async sendMostRead({ chatId, header, lang, mostread }: TgWikiMostReadParams) {
    const { articles, date } = mostread;

    const article = articles.at(0);

    if (!article) {
      return;
    }

    header += ` (${article.views})`;

    await this.sendArticle({
      chatId,
      header,
      lang,
      article,
      tags: ['most_read'],
    });
  }

  async sendListArticles({
    articles,
    chatId,
    header,
    lang,
    tags,
  }: TgWikiListParams) {
    let content = '';

    for (const article of articles) {
      content += `\n• ${getArticleTitleHtml(article)}`;

      if (article.description) {
        content += ` - ${article.description}`;
      }

      content += ';';
    }

    const html = getHTML({
      content,
      lang,
      header,
      tags,
    });

    const article = articles.find(getArticleImage);
    const sanitizedHtml = getPreparedHtml(html, lang);
    const extra = getDefaultExtra();

    if (article) {
      const image = getArticleImage(article);

      if (image) {
        this.bot.telegram.sendPhoto(
          chatId,
          {
            url: image.source,
          },
          {
            ...extra,
            caption: sanitizedHtml,
          },
        );

        return;
      }
    }

    await this.bot.telegram.sendMessage(chatId, sanitizedHtml, extra);
  }

  async sendOnThisDay({
    chatId,
    header: mainHeader,
    lang,
    onthisday,
  }: TgWikiOnThisDayParams) {
    for (const { pages, text, year } of onthisday) {
      const date = dayjs().year(year).locale(lang);
      const header = `${mainHeader} (${date.format('DD MMMM YYYY')})\n\n${text}\n`;
      const tags = ['on_this_day', date.format('DD_MMMM_YYYY')];

      await this.sendListArticles({
        chatId,
        header,
        lang,
        articles: pages,
        tags,
      });
    }
  }

  async sendNews({ chatId, lang, news, header: mainHeader }: TgWikiNewsParams) {
    for (const { links, story } of news) {
      const header = `${mainHeader}\n\n${story}\n`;
      const tags = [
        'news',
        dayjs(links[0].timestamp).locale(lang).format('DD_MMMM_YYYY'),
      ];

      await this.sendListArticles({
        chatId,
        header,
        lang,
        articles: links,
        tags,
      });
    }
  }

  sendArticle({ article, chatId, lang, header, tags }: TgWikiArticleParams) {
    const image = getArticleImage(article);
    const extra = getArticleExtra(lang, article.content_urls.mobile.page);
    const html = getArticleHTML({
      title: article.titles.normalized,
      url: article.content_urls.mobile.page,
      content: article.extract_html,
      description: article.description,
      header,
      lang,
      tags,
    });

    if (image) {
      return this.bot.telegram.sendPhoto(
        chatId,
        {
          url: image.source,
        },
        {
          ...extra,
          caption: html,
        },
      );
    }

    return this.bot.telegram.sendMessage(chatId, html, extra);
  }
}
