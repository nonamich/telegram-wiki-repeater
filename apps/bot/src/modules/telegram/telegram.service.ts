import path from 'node:path';

import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { InjectBot } from 'nestjs-telegraf';
import sanitizeHtml, { IOptions as SanitizeHtmlOptions } from 'sanitize-html';
import { Markup, Telegraf } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { Schemas, db, drizzle } from '@repo/db';

import {
  WikiArticle,
  WikiImage,
  WikiLanguage,
  ArticleSource,
} from '~/modules/wiki/interfaces';

import { I18N_SUPPORTED_LANGS } from './i18n/telegram.i18n.constants';
import {
  ArticleHTMLParams,
  TelegramFeaturedWikiImageParams,
  TelegramWikiArticleParams,
  MyContext,
} from './interfaces';
import { TELEGRAM_ALLOWED_TAGS } from './telegram.constants';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private bot: Telegraf<MyContext>) {}

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

  getLangDashboard(defaultLang: string) {
    const inlineKeyboard: InlineKeyboardButton[] = [];

    for (const [langCode, data] of Object.entries(I18N_SUPPORTED_LANGS)) {
      let icon = data.icon;

      if (defaultLang === langCode) {
        icon = '✅';
      }

      inlineKeyboard.push(
        Markup.button.callback(`${icon} ${data.name}`, `lang-${langCode}`),
      );
    }

    return {
      text: '🌍 Choose Your Language',
      extra: {
        reply_markup: {
          inline_keyboard: _.chunk(inlineKeyboard, 3),
        },
      },
    };
  }

  sendFeaturedWikiImage({
    chatId,
    image,
    lang,
  }: TelegramFeaturedWikiImageParams) {
    const title = image.title.replace(/^File:|\.(png|jpg|svg)$/g, '');
    const extra = this.getDefaultExtra(image.file_page);

    return this.bot.telegram.sendPhoto(
      chatId,
      {
        url: image.thumbnail.source,
      },
      {
        ...extra,
        caption: this.getArticleHTML({
          title,
          lang,
          beforeTitle: this.getTitleOfType('image'),
          url: image.file_page,
          content: image.description.html,
        }),
      },
    );
  }

  sendWikiArticle({ article, chatId, lang, type }: TelegramWikiArticleParams) {
    const image = this.getImageArticle(article);
    const extra = this.getDefaultExtra(article.content_urls.mobile.page);
    const html = this.getArticleHTML({
      title: article.titles.normalized,
      url: article.content_urls.mobile.page,
      content: article.extract_html,
      description: article.description,
      beforeTitle: this.getTitleOfType(type),
      lang,
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

  private getDefaultExtra(source: string, replyId?: number): ExtraReplyMessage {
    return {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[Markup.button.url('🔗 Source', source)]],
      },
      reply_to_message_id: replyId,
    };
  }

  private getImageArticle(article: WikiArticle) {
    let image: WikiImage | undefined;

    if (
      article.originalimage &&
      (article.originalimage.width <= 3000 ||
        article.originalimage.height <= 3000)
    ) {
      image = article.originalimage;
    } else if (article.thumbnail) {
      image = article.thumbnail;
    }

    return image;
  }

  private getTitleOfType(type: ArticleSource) {
    switch (type) {
      case 'image':
        return '🖼️ Daily Featured Image';
      case 'mostread':
        return '⚡ Most Read Article';
      case 'news':
        return "📰 Stories From Today's News";
      case 'onthisday':
        return '🏺 On This Day In History';
      case 'tfa':
        return "⭐ Today's Featured Article";
    }
  }

  private getArticleHTML({
    content,
    url,
    title,
    beforeTitle = '',
    lang,
    description,
  }: ArticleHTMLParams) {
    let html = ``;

    if (beforeTitle) {
      html += `<strong>${beforeTitle}</strong>\n\n`;
    }

    html += `<a href="${url}"><strong>${title}</strong></a>`;

    if (description) {
      html += ` - <i>${description}</i>`;
    }

    html += `\n\n${this.prepareHtml(content, lang)}`;

    return html;
  }

  private prepareHtml(html: string, lang: WikiLanguage): string {
    return sanitizeHtml(html, this.getSanitizeHtmlOptions(lang));
  }

  private getSanitizeHtmlOptions(lang: WikiLanguage): SanitizeHtmlOptions {
    return {
      exclusiveFilter: (frame) => !frame.text.trim(),
      transformTags: {
        a: (tagName, attribs) => {
          if (attribs.href && attribs.rel === 'mw:WikiLink') {
            attribs.href = path.join(
              `https://${lang}.wikipedia.org/wiki/`,
              attribs.href,
            );
          }

          return {
            tagName,
            attribs,
          };
        },
      },
      allowedTags: TELEGRAM_ALLOWED_TAGS,
    };
  }
}
