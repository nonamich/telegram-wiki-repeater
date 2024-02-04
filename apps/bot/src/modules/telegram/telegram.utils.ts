import path from 'node:path';

import sanitizeHtml, { IOptions as SanitizeHtmlOptions } from 'sanitize-html';
import { Markup } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { RedisType } from '../cache/cache.type';
import { WikiArticle, WikiImage } from '../wiki/interfaces';
import * as langs from './i18n/languages';
import { TelegramLanguage } from './i18n/telegram.i18n.interface';
import { ArticleHTMLParams, HTMLParams } from './interfaces';
import { TELEGRAM_ALLOWED_TAGS } from './telegram.constants';

export const getSessionStore = (redis: RedisType) => {
  const prefix = 'telegraf:';

  return {
    async get(key) {
      const value = await redis.get(`${prefix}${key}`);

      return value ? JSON.parse(value) : undefined;
    },

    set(key: string, data: object) {
      return redis.set(`${prefix}${key}`, JSON.stringify(data));
    },

    delete(key: string) {
      return redis.del(`${prefix}${key}`);
    },
  };
};

export const getPreparedHtml = (
  html: string,
  lang: TelegramLanguage,
): string => {
  return sanitizeHtml(html, getSanitizeHtmlOptions(lang));
};

export const getSanitizeHtmlOptions = (
  lang: TelegramLanguage,
): SanitizeHtmlOptions => {
  return {
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href && attribs.rel === 'mw:WikiLink') {
          const urlObj = new URL(`https://${lang}.m.wikipedia.org/wiki/`);

          urlObj.pathname = path.join(urlObj.pathname, attribs.href);

          attribs.href = urlObj.toString();
        }

        return {
          tagName,
          attribs,
        };
      },
    },
    allowedTags: TELEGRAM_ALLOWED_TAGS,
  };
};

export const getArticleImage = (article: WikiArticle) => {
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
};

export const getDefaultExtra = (): ExtraReplyMessage => {
  return {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
};

export const getArticleExtra = (
  lang: TelegramLanguage,
  url: string,
): ExtraReplyMessage => {
  const {
    default: { source },
  } = langs[lang];

  return {
    ...getDefaultExtra(),
    reply_markup: {
      inline_keyboard: [[Markup.button.url(`🔗 ${source}`, url)]],
    },
  };
};

export const getArticleHTML = ({
  content,
  url,
  title,
  header,
  lang,
  description,
  tags,
}: ArticleHTMLParams) => {
  let html = ``;

  header += `\n\n<a href="${url}"><strong>${title}</strong></a> `;

  if (description) {
    header += ` - <i>${description}</i>`;
  }

  header += '\n\n';

  html += getHTML({
    content: getPreparedHtml(content, lang),
    header,
    lang,
    tags,
  });

  return html;
};

export const getHTML = ({ content, header, lang, tags }: HTMLParams) => {
  let html = ``;

  html += `<strong>${header}</strong>`;

  html += `${getPreparedHtml(content, lang)}`;

  if (tags.length) {
    html += '\n\n';
    html += tags.map((tag) => `#${tag}`).join(' ');
  }

  return html;
};

export const getArticleTitleHtml = (article: WikiArticle) => {
  return `<strong><a href="${article.content_urls.mobile.page}">${article.titles.normalized}</a><strong>`;
};
