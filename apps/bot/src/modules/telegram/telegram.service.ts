import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import lodash from 'lodash';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';

import { Schemas, db, drizzle } from '@repo/db';
import { Utils } from '@repo/shared';

import { CacheService } from '~/modules/cache/cache.service';

import { DAY_IN_SEC } from '../cache/cache.constants';
import { WikiArticle, WikiImage } from '../wiki/interfaces';
import { WikiService } from '../wiki/wiki.service';
import * as langs from './i18n/languages';
import { TelegramI18nService } from './i18n/telegram.i18n.service';
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
import { BOT_NAME, MAX_CONTENT_CAPTION } from './telegram.constants';
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
    private readonly tgI18n: TelegramI18nService,
  ) {}

  isBestTime() {
    const hours = new Date().getHours();

    return (hours >= 17 && hours < 20) || (hours >= 22 && hours < 24);
  }

  async run(ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    const date = new Date();
    const lang = this.tgI18n.getLang(ctx.i18next.language);
    const featuredContent = await this.wiki.getFeaturedContent({
      lang,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    const baseParams = { chatId: ctx.chat.id, lang };
    const { image, mostread, tfa, onthisday, news } = featuredContent;
    const isBestTime = this.isBestTime();

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
        header: `🏛 ${ctx.i18next.t('article.header.onthisday')}:`,
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

    if (isBestTime) {
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
          tags: [ctx.i18next.t('tags.tfa')],
        });
      }
    }
  }

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

    const {
      default: {
        tags: { image: imageTag },
      },
    } = langs[lang];

    await this.bot.telegram.sendPhoto(
      chatId,
      {
        url: image.thumbnail.source,
      },
      {
        caption: getArticleHTML({
          ...args,
          title,
          lang,
          url: image.file_page,
          content: image.description.html,
          tags: [imageTag],
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
        expireInSec: 0,
        chatId,
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

      if (header.length + content.length >= MAX_CONTENT_CAPTION) {
        break;
      }
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
      await Utils.sleep(2000); // fix for IMAGE_PROCESS_FAILED error

      return;
    }

    const html = getHTMLTemplate(htmlParams);

    await this.bot.telegram.sendMessage(chatId, html, getDefaultExtra());
  }

  async sendOnThisDay({
    header: mainHeader,
    lang,
    onthisday,
    ...args
  }: TgWikiOnThisDayParams) {
    for (const { pages, text, year } of onthisday) {
      const date = dayjs().year(year).locale(lang);
      const header = `${mainHeader} ${lodash.capitalize(text)} (${year})\n`;
      const {
        default: {
          tags: { on_this_day: onThisDayTag },
        },
      } = langs[lang];
      const tags = [onThisDayTag, date.format('DD_MMMM_YYYY')];
      const pathSource = lodash.capitalize(date.format('MMMM_D'));
      let source: string | undefined;

      if (lang !== 'ar') {
        source = encodeURI(`https://${lang}.wikipedia.org/wiki/${pathSource}`);
      }

      await this.sendListArticles({
        ...args,
        header,
        lang,
        articles: pages,
        tags,
        source,
      });

      break;
    }
  }

  async sendNews({
    lang,
    news,
    header: mainHeader,
    ...args
  }: TgWikiNewsParams) {
    for (const { links, story } of news) {
      const header = `${mainHeader} ${getPreparedHtml(story, lang)}\n`;
      const {
        default: {
          tags: { news: newsTag },
        },
      } = langs[lang];
      const tags = [
        newsTag,
        dayjs(links[0].timestamp).locale(lang).format('DD_MMMM_YYYY'),
      ];

      await this.sendListArticles({
        ...args,
        header,
        lang,
        articles: links,
        tags,
      });
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

  private getSkipCageKey({ id, chatId, lang }: SkipParams) {
    return `skip:${lang}:${chatId}:${id}`;
  }

  private async setSkipCache({
    expireInSec = DAY_IN_SEC,
    ...args
  }: SetSkipParams) {
    const key = this.getSkipCageKey(args);

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

    const key = this.getSkipCageKey(args);
    const value = await this.cache.redis.get(key);

    return !!value;
  }
}
