import { UseFilters } from '@nestjs/common';

import { Update, Start, Ctx, Action } from 'nestjs-telegraf';

import { WikiService } from '~/modules/wiki/wiki.service';

import { WikiLanguage } from '../wiki/interfaces/common.interface';
import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { I18N_SUPPORTED_LANGS } from './i18n/telegram.i18n.constants';
import { MyContext } from './interfaces/telegraf.interface';
import { TelegramService } from './telegram.service';

@Update()
@UseFilters(new TelegrafExceptionFilter())
export class TelegramUpdate {
  constructor(
    private readonly wikiService: WikiService,
    private readonly tgService: TelegramService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: MyContext) {
    if (!ctx.chat?.id) {
      return;
    }

    let chat = await this.tgService.getChat(ctx.chat.id);

    if (chat) {
      await ctx.i18next.changeLanguage(chat.lang);
    } else {
      const [chatUpdated] = await this.tgService.insetOrUpdateChat(
        ctx.chat.id,
        ctx.i18next.language,
      );

      chat = chatUpdated;
    }

    const { text, extra } = this.tgService.getLangDashboard(chat.lang);

    await ctx.sendMessage(text, extra);
  }

  @Action(/^lang-(\w+)$/)
  async onLang(@Ctx() ctx: MyContext) {
    if (!ctx.chat?.id) {
      return;
    }

    const lang = ctx.match?.at(1);

    if (!lang || !(lang in I18N_SUPPORTED_LANGS)) {
      return ctx.answerCbQuery(`This language is not supported`);
    }

    const { extra } = this.tgService.getLangDashboard(lang);

    await this.tgService.insetOrUpdateChat(ctx.chat.id, lang);

    await ctx.i18next.changeLanguage(lang);

    await ctx.editMessageReplyMarkup(extra.reply_markup);
    await ctx.answerCbQuery();
  }

  async onStart2(@Ctx() ctx: MyContext) {
    if (!ctx.chat?.id) {
      return;
    }

    let pinMessageId: number | undefined;
    const date = new Date();
    const lang: WikiLanguage = 'en';
    const { image, mostread, tfa } = await this.wikiService.getFeaturedContent({
      lang,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    const baseParams = {
      chatId: ctx.chat.id,
      lang,
    };

    if (tfa) {
      const message = await this.tgService.sendWikiArticle({
        ...baseParams,
        article: tfa,
        type: 'tfa',
      });

      pinMessageId = message.message_id;
    }

    if (image) {
      const message = await this.tgService.sendFeaturedWikiImage({
        ...baseParams,
        image,
      });

      if (!pinMessageId) {
        pinMessageId = message.message_id;
      }
    }

    if (mostread) {
      const article = mostread.articles.at(0);

      if (article) {
        await this.tgService.sendWikiArticle({
          ...baseParams,
          article,
          type: 'mostread',
        });
      }
    }

    // if (onthisday) {
    //   const article = onthisday.pages.at(0);

    //   if (article) {
    //     await this.tgService.sendWikiArticle(ctx.chat.id, article);
    //   }
    // }

    if (pinMessageId) {
      await ctx.pinChatMessage(pinMessageId);
    }
  }
}
