import { UseFilters } from '@nestjs/common';

import { Update, Start, Ctx, Command } from 'nestjs-telegraf';

import { WikiService } from '~/modules/wiki/wiki.service';

import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { TelegramI18nService } from './i18n/telegram.i18n.service';
import { SceneContext } from './interfaces/telegraf.interface';
import { COMMANDS, SCENE_IDS } from './telegram.constants';
import { TelegramService } from './telegram.service';

@Update()
@UseFilters(new TelegrafExceptionFilter())
export class TelegramUpdate {
  constructor(
    private readonly wiki: WikiService,
    private readonly tg: TelegramService,
    private readonly tgI18n: TelegramI18nService,
  ) {}

  @Start()
  @Command('lang')
  async onStart(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(SCENE_IDS.GREETER);
  }

  @Command(COMMANDS.SHOW)
  async onShow(@Ctx() ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    const date = new Date();
    const lang = this.tgI18n.getLang(ctx.i18next.language);
    const featuredContent = await this.wiki.getFeaturedContent({
      lang,
      // year: date.getFullYear(),
      // month: date.getMonth() + 1,
      // day: date.getDate(),
      year: 2024,
      month: 2,
      day: 4,
    });
    const baseParams = { chatId: ctx.chat.id, lang };

    const { image, mostread, tfa, onthisday, news } = featuredContent;

    if (mostread) {
      await this.tg.sendMostRead({
        ...baseParams,
        header: `⚡ ${ctx.i18next.t('article.header.mostread')}`,
        mostread,
      });
    }

    // if (onthisday) {
    //   await this.tg.sendOnThisDay({
    //     ...baseParams,
    //     header: `🏛 ${ctx.i18next.t('article.header.onthisday')}`,
    //     onthisday,
    //   });
    // }

    // if (news) {
    //   await this.tg.sendNews({
    //     ...baseParams,
    //     header: `📰 ${ctx.i18next.t('article.header.news')}`,
    //     news,
    //   });
    // }

    // if (image) {
    //   await this.tg.sendWikiImage({
    //     ...baseParams,
    //     header: `🖼️ ${ctx.i18next.t('article.header.image')}`,
    //     image,
    //   });
    // }

    // if (tfa) {
    //   await this.tg.sendArticle({
    //     ...baseParams,
    //     header: `⭐ ${ctx.i18next.t('article.header.tfa')}`,
    //     article: tfa,
    //     tags: ['daily_article'],
    //   });
    // }
  }
}
