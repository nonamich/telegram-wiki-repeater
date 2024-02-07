import { setTimeout as sleep } from 'node:timers/promises';

import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import lodash from 'lodash';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';

import { CacheService } from '~/modules/cache/cache.service';

import { DAY_IN_SEC } from '../cache/cache.constants';
import { WikiArticle, WikiImage } from '../wiki/interfaces';
import { WikiService } from '../wiki/wiki.service';
import * as langs from './i18n/languages';
import { TelegramLanguage } from './i18n/telegram.i18n.interface';
import {
  TgWikiImageParams,
  TgWikiArticleParams,
  SceneContext,
  TgWikiNewsParams,
  TgWikiMostReadParams,
  TgWikiListParams,
  SkipParams,
  SetSkipParams,
  HTMLParams,
} from './interfaces';
import { TgWikiOnThisDayParams } from './interfaces/onthisday.interface';
import {
  BOT_NAME,
  CYCLES_RUN,
  MAX_CONTENT_CAPTION,
} from './telegram.constants';
import {
  getArticleHTML,
  getArticleTitleHtml,
  getDefaultExtra,
  getHTMLTemplate,
  getArticleImage,
  getPreparedHtml,
} from './telegram.utils';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot(BOT_NAME) private bot: Telegraf<SceneContext>,
    private readonly cache: CacheService,
    private readonly wiki: WikiService,
  ) {}

  isBestTime() {
    const hours = new Date().getHours();

    return (hours >= 17 && hours < 20) || hours >= 22;
  }

  async inform(chatId: number, lang: TelegramLanguage) {
    const date = new Date();
    const { default: translate } = langs[lang];
    const featuredContent = await this.wiki.getFeaturedContent({
      lang,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    const baseParams = { chatId, lang };
    const { image, mostread, tfa, onthisday, news } = featuredContent;

    if (mostread) {
      await this.sendMostRead({
        ...baseParams,
        header: `⚡ `,
        mostread,
      });
    }

    if (onthisday) {
      await this.sendOnThisDay({
        ...baseParams,
        header: `🏛 ${translate.article.header.onthisday}: `,
        onthisday,
      });
    }

    if (news) {
      await this.sendNews({
        ...baseParams,
        header: '🆕 ',
        news,
      });
    }

    if (this.isBestTime()) {
      if (image) {
        await this.sendWikiFeaturedImage({
          ...baseParams,
          header: '🖼️ ',
          image,
        });
      }

      if (tfa) {
        await this.sendTFA({
          ...baseParams,
          header: '⭐ ',
          article: tfa,
          tags: [translate.tags.tfa],
        });
      }
    }
  }

  async sendWikiFeaturedImage({
    chatId,
    image,
    lang,
    ...args
  }: TgWikiImageParams) {
    const skipParams = {
      id: `image:${image.wb_entity_id}`,
      chatId,
      lang,
      expireInSec: DAY_IN_SEC * 2,
    };

    const isSkipped = await this.isSkipExists(skipParams);

    if (isSkipped) {
      return;
    }

    const title = image.title.replace(/^File:|\.(png|jpg|svg)$/g, '');

    const { default: translate } = langs[lang];

    await this.bot.telegram.sendPhoto(
      chatId,
      {
        url: image.thumbnail.source,
      },
      {
        ...getDefaultExtra(),
        caption: getArticleHTML({
          ...args,
          title,
          lang,
          url: image.file_page,
          content: image.description.html,
          tags: [translate.tags.image],
          maxLength: MAX_CONTENT_CAPTION,
        }),
      },
    );

    await this.setSkipCache(skipParams);
  }

  async sendMostRead({ lang, mostread, ...args }: TgWikiMostReadParams) {
    const { articles } = mostread;
    const { default: translate } = langs[lang];

    const skipParams = {
      id: 'mostRead',
      chatId: args.chatId,
      lang,
      expireInSec: DAY_IN_SEC / 2,
    };

    const isSkipped = await this.isSkipExists(skipParams);

    if (isSkipped) {
      return;
    }

    for (const article of articles) {
      const { isSkipped } = await this.sendArticle({
        ...args,
        lang,
        article,
        tags: [translate.tags.mostread],
        expireInSec: DAY_IN_SEC * 3,
      });

      if (!isSkipped) {
        await this.setSkipCache(skipParams);

        break;
      }
    }
  }

  getMediaGroup(articles: WikiArticle[]) {
    const images = articles
      .map(getArticleImage)
      .filter((image): image is WikiImage => !!image);

    return images.map((image) => {
      const inputMedia: InputMediaPhoto = {
        type: 'photo',
        media: {
          url: image.source,
        },
      };

      return inputMedia;
    });
  }

  async sendListArticles({
    articles,
    header,
    chatId,
    ...args
  }: TgWikiListParams) {
    if (articles.length <= 1) {
      header += '\n';

      await this.sendArticle({
        ...args,
        article: articles[0],
        header,
        chatId,
        expireInSec: 0,
      });

      return;
    }

    let content = '';

    for (const article of articles) {
      let item = '';

      item += `\n• ${getArticleTitleHtml(article)}`;

      if (article.description) {
        item += ` - ${article.description}`;
      }

      item += ';';

      content += item;
    }

    const htmlParams: HTMLParams = {
      ...args,
      header,
      content,
    };

    const mediaGroup = this.getMediaGroup(articles);

    if (mediaGroup.length) {
      const html = getHTMLTemplate({
        ...htmlParams,
        maxLength: MAX_CONTENT_CAPTION,
      });

      mediaGroup[0].caption = html;
      mediaGroup[0].parse_mode = 'HTML';

      await this.bot.telegram.sendMediaGroup(chatId, mediaGroup);
      await sleep(2000); // fix for IMAGE_PROCESS_FAILED error

      setTimeout;

      return;
    }

    const html = getHTMLTemplate(htmlParams);

    await this.bot.telegram.sendMessage(chatId, html, getDefaultExtra());
  }

  async sendOnThisDay({
    header: mainHeader,
    lang,
    onthisday,
    chatId,
    ...args
  }: TgWikiOnThisDayParams) {
    const numberToSend = Math.min(Math.round(onthisday.length / CYCLES_RUN));
    let numberSkips = 0;

    for (const { pages, text, year } of onthisday) {
      const skipParams = {
        id: 'onthisday:' + pages.map(({ pageid }) => pageid).join(','),
        chatId,
        lang,
      };

      const isSkipped = await this.isSkipExists(skipParams);

      if (isSkipped) {
        continue;
      }

      const { default: translate } = langs[lang];
      const date = dayjs().locale(lang).year(year);

      const header = `${mainHeader} ${lodash.capitalize(text)} (${year})\n`;
      const tags = [translate.tags.on_this_day, date.format('DD_MMMM_YYYY')];
      const pathSource = lodash.capitalize(date.format('MMMM_D'));
      let source: string | undefined;

      if (lang !== 'ar') {
        source = encodeURI(`https://${lang}.wikipedia.org/wiki/${pathSource}`);
      }

      await this.sendListArticles({
        ...args,
        header,
        lang,
        chatId,
        articles: pages,
        tags,
        source,
      });

      await this.setSkipCache(skipParams);

      numberSkips++;

      if (numberSkips >= numberToSend) {
        break;
      }
    }
  }

  async sendNews({
    lang,
    news,
    chatId,
    header: mainHeader,
    ...args
  }: TgWikiNewsParams) {
    const numberToSend = Math.min(Math.round(news.length / CYCLES_RUN));
    let numberSkips = 0;

    for (const { links, story } of news) {
      const skipParams = {
        id: 'news:' + links.map(({ pageid }) => pageid).join(','),
        chatId,
        lang,
        expireInSec: DAY_IN_SEC * 3,
      };

      const isSkipped = await this.isSkipExists(skipParams);

      if (isSkipped) {
        continue;
      }

      const header = `${mainHeader} ${getPreparedHtml(story, lang)}\n`;
      const { default: translate } = langs[lang];
      const tags = [
        translate.tags.news,
        dayjs(links[0].timestamp).locale(lang).format('DD_MMMM_YYYY'),
      ];

      await this.sendListArticles({
        ...args,
        header,
        lang,
        chatId,
        articles: links,
        tags,
      });

      await this.setSkipCache(skipParams);

      numberSkips++;

      if (numberSkips >= numberToSend) {
        break;
      }
    }
  }

  async sendTFA(args: TgWikiArticleParams) {
    await this.sendArticle(args);
  }

  async sendArticle({
    article,
    chatId,
    lang,
    expireInSec,
    ...args
  }: TgWikiArticleParams) {
    const skipParams = {
      chatId,
      lang,
      id: `article:${article.pageid}`,
      expireInSec,
    };

    const isSkipped = await this.isSkipExists(skipParams);

    if (isSkipped) {
      return { isSkipped };
    }

    const image = getArticleImage(article);
    const extra = getDefaultExtra();
    const html = getArticleHTML({
      ...args,
      title: article.titles.normalized,
      url: article.content_urls.mobile.page,
      content: article.extract_html,
      description: article.description,
      lang,
      source: article.content_urls.mobile.page,
      maxLength: MAX_CONTENT_CAPTION,
    });

    if (image) {
      await this.bot.telegram.sendPhoto(
        chatId,
        {
          url: image.source,
        },
        {
          ...extra,
          caption: html,
        },
      );
    } else {
      await this.bot.telegram.sendMessage(chatId, html, extra);
    }

    await this.setSkipCache(skipParams);

    return { isSkipped };
  }

  private getSkipCacheKey({ id, chatId, lang }: SkipParams) {
    return `skip:${lang}:${chatId}:${id}`;
  }

  private async setSkipCache({
    expireInSec = DAY_IN_SEC,
    ...args
  }: SetSkipParams) {
    const key = this.getSkipCacheKey(args);

    if (!expireInSec) {
      return false;
    }

    await this.cache.redis.set(key, 'true', {
      EX: expireInSec,
    });
  }

  private async isSkipExists({
    expireInSec = DAY_IN_SEC,
    ...args
  }: SkipParams) {
    if (!expireInSec) {
      return false;
    }

    const key = this.getSkipCacheKey(args);
    const value = await this.cache.redis.get(key);

    return !!value;
  }
}
