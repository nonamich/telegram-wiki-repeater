import _ from 'lodash';
import { Action, Ctx, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { I18N_SUPPORTED_LANGS } from '../i18n/telegram.i18n.constants';
import * as langs from '../i18n/telegram.i18n.langs';
import { TelegramI18nService } from '../i18n/telegram.i18n.service';
import { SceneContext } from '../interfaces';
import { SCENE_IDS } from '../telegram.constants';
import { TelegramService } from '../telegram.service';

@Scene(SCENE_IDS.GREETER)
export class GreeterScene {
  constructor(
    private readonly tg: TelegramService,
    private readonly tgI18n: TelegramI18nService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    let chat = await this.tg.getChat(ctx.chat.id);

    if (!chat) {
      const [chatUpdated] = await this.tg.insetOrUpdateChat(
        ctx.chat.id,
        ctx.i18next.language,
      );

      chat = chatUpdated;
    }

    const lang = this.tgI18n.getLang(chat.lang);
    const inlineKeyboard = this.getLangInlineKeyboard();

    await ctx.i18next.changeLanguage(lang);

    await ctx.sendMessage(`🌍 ${ctx.i18next.t('chooseLang')}`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  getLangInlineKeyboard() {
    const columns = 3;
    const inlineKeyboard: InlineKeyboardButton[] = [];

    for (const lang of I18N_SUPPORTED_LANGS) {
      const {
        translation: { iconLang, langName },
      } = langs[lang];

      inlineKeyboard.push(
        Markup.button.callback(`${iconLang} ${langName}`, `lang-${lang}`),
      );
    }

    return _.chunk(inlineKeyboard, columns);
  }

  @Action(/^lang-(\w\w)$/)
  async actionLang(@Ctx() ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    const selectedLang = ctx.match?.at(1);
    const lang = this.tgI18n.getLang(selectedLang);

    if (lang !== ctx.i18next.language) {
      await ctx.i18next.changeLanguage(lang);

      await this.tg.insetOrUpdateChat(ctx.chat.id, lang);
    }

    const newText = `✅ ${ctx.i18next.t('chosen')}: ${ctx.i18next.t('iconLang')} ${ctx.i18next.t('langName')}`;

    await ctx.editMessageText(newText);
    await ctx.scene.leave();
  }

  @SceneLeave()
  async leaveScene(@Ctx() ctx: SceneContext) {
    await ctx.sendMessage(ctx.i18next.t('greeter.leave'));
  }
}
