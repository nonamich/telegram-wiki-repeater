import { setTimeout as sleep } from 'node:timers/promises';

import lodash from 'lodash';
import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { I18N_LANGS_INFO } from '../i18n/telegram.i18n.constants';
import { TelegramLanguageList } from '../i18n/telegram.i18n.interface';
import { TelegramI18nService } from '../i18n/telegram.i18n.service';
import { SceneContext } from '../interfaces';
import { TelegramChatService } from '../telegram.chat.service';
import { COMMANDS, SCENE_IDS } from '../telegram.enums';
import { TelegramService } from '../telegram.service';

@Scene(SCENE_IDS.GREETER)
export class GreeterScene {
  constructor(
    private readonly tg: TelegramService,
    private readonly tgI18n: TelegramI18nService,
    private readonly chatService: TelegramChatService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    let chat = await this.chatService.getChat(ctx.chat.id);

    ctx.scene.state['isNewMember'] = !chat;

    if (!chat) {
      const [chatUpdated] = await this.chatService.insetOrUpdateChat(
        ctx.chat.id,
        ctx.i18next.language,
      );

      chat = chatUpdated;
    }

    const lang = this.tgI18n.getLang(chat.lang);
    const inlineKeyboard = this.getLangInlineKeyboard(ctx);

    await ctx.i18next.changeLanguage(lang);

    await ctx.sendMessage(`🌍 ${ctx.i18next.t('chooseLang')}`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  getLangInlineKeyboard(ctx: SceneContext) {
    const columns = 3;
    const inlineKeyboard: InlineKeyboardButton[] = [];

    let lang: keyof TelegramLanguageList;

    for (lang in I18N_LANGS_INFO) {
      const info = I18N_LANGS_INFO[lang];

      inlineKeyboard.push(
        Markup.button.callback(`${info.icon} ${info.name}`, `lang-${lang}`),
      );
    }

    inlineKeyboard.push(
      Markup.button.callback(`↩ ${ctx.i18next.t('back')}`, 'back'),
    );

    return lodash.chunk(inlineKeyboard, columns);
  }

  @Action(/^lang-(\w\w)$/)
  async actionLang(@Ctx() ctx: SceneContext) {
    if (!ctx.chat?.id) {
      return;
    }

    const selectedLang = ctx.match?.at(1);
    const lang = this.tgI18n.getLang(selectedLang);
    const langInfo = I18N_LANGS_INFO[lang];

    if (lang !== ctx.i18next.language) {
      await ctx.i18next.changeLanguage(lang);

      await this.chatService.insetOrUpdateChat(ctx.chat.id, lang);
    }

    const newText = `✅ ${ctx.i18next.t('chosen')}: ${langInfo.icon} ${langInfo.name}`;

    await ctx.editMessageText(newText);
    await ctx.telegram.deleteMyCommands();
    await ctx.telegram.setMyCommands([
      {
        command: COMMANDS.LANG,
        description: ctx.i18next.t('set_lang'),
      },
      {
        command: COMMANDS.SHOW,
        description: ctx.i18next.t('show'),
      },
    ]);

    await ctx.sendMessage(ctx.i18next.t('greeter.leave'));
    await ctx.scene.leave();

    if (!ctx.scene.state['isNewMember']) {
      return;
    }

    await sleep(5000);
    await this.tg.inform(ctx.chat.id, lang);
  }

  @Action('back')
  async onBack(@Ctx() ctx: SceneContext) {
    await ctx.deleteMessage();
    await ctx.scene.leave();
  }
}
