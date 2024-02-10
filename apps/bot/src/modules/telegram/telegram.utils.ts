import path from 'node:path';

import { Redis } from 'ioredis';
import lodash from 'lodash';
import sanitizeHtml, { IOptions as SanitizeHtmlOptions } from 'sanitize-html';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import truncateHtml from 'truncate-html';

import { Utils } from '@repo/shared';

import { WikiArticle, WikiImage } from '../wiki/interfaces';
import * as langs from './i18n/languages';
import { TelegramLanguage } from './i18n/telegram.i18n.interface';
import { ArticleHTMLParams, HTMLParams } from './interfaces';
import {
  MAX_CONTENT_MESSAGE,
  TELEGRAM_ALLOWED_TAGS,
} from './telegram.constants';

export const getSessionStore = (redis: Redis) => {
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

export const getPreparedHtml = (html: string, lang: TelegramLanguage) => {
  return sanitizeHtml(html, getSanitizeHtmlOptions(lang));
};

export const getSanitizeHtmlOptions = (
  lang: TelegramLanguage,
): SanitizeHtmlOptions => {
  return {
    allowedTags: TELEGRAM_ALLOWED_TAGS,
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
  };
};

export const getArticleImage = (article: WikiArticle) => {
  const images = [article.originalimage, article.thumbnail].filter(
    (image): image is WikiImage => !!image,
  );
  const maxW = 3000;
  const maxH = 3000;
  const minW = 200;
  const minH = 200;

  return images.find((image) => {
    return (
      Utils.isBetween(image.width, minW, maxW) &&
      Utils.isBetween(image.height, minH, maxH)
    );
  });
};

export const getDefaultExtra = (): ExtraReplyMessage => {
  return {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
};

export const getArticleHTML = ({
  content,
  url,
  title,
  header,
  lang,
  description,
  ...args
}: ArticleHTMLParams) => {
  let html = ``;

  header += `<a href="${url}"><strong>${title}</strong></a>`;

  if (description) {
    header += ` - <i>${description}</i>`;
  }

  header += '\n\n';

  html += getHTMLTemplate({
    content,
    header,
    lang,
    ...args,
  });

  return html;
};

export const getHTMLTemplate = ({
  content,
  header,
  lang,
  tags,
  links = [],
  source,
  maxLength = MAX_CONTENT_MESSAGE,
}: HTMLParams) => {
  let html = ``;
  const { default: translate } = langs[lang];

  let ellipsis = '...';

  if (source) {
    ellipsis += `\n<a href="${source}">${translate.read_more.toLowerCase()}</a>`;
  }

  html += `<strong>${header}</strong>`;
  html += `${getPreparedHtml(content, lang)}`;
  html = truncateHtml(html, {
    keepWhitespaces: true,
    length: maxLength,
    ellipsis,
  });

  if (tags.length) {
    html += '\n\n';
    html += tags.map((tag) => `#${tag.replaceAll(' ', '_')}`).join(' ');
  }

  if (source) {
    links.unshift({
      text: `🔗 ${translate.source}`,
      href: source,
    });
  }

  links.unshift({
    text: `💸 ${translate.support_wikipedia}`,
    href: 'https://bit.ly/3UxVjAh',
  });

  html += `\n\n${links
    .map(({ href, text }) => {
      return `<a href="${href}">${text}</a>`;
    })
    .join(' | ')}`;

  return html;
};

export const getArticleTitleHtml = (article: WikiArticle) => {
  return `<strong><a href="${article.content_urls.mobile.page}">${lodash.capitalize(article.titles.normalized)}</a></strong>`;
};
