import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Action,
  Ctx,
  Message,
  On,
  TelegrafException,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Chat } from 'telegraf/types';

import { I18nContext } from '~/modules/i18n/i18n.context';
import { CurrentChat } from '~/modules/telegram/decorators/current-chat.decorator';
import { SCENES } from '~/modules/telegram/telegram.enums';
import { TelegramSender } from '~/modules/telegram/telegram.sender';
import { Context } from '~/modules/telegram/telegram.types';
import { WikiLanguage } from '~/modules/wiki/types';
import { WIKI_LANGUAGES } from '~/modules/wiki/wiki.constants';
import { WikiService } from '~/modules/wiki/wiki.service';

dayjs.extend(customParseFormat);

const dataFormat = 'DD-MM-YYYY';

@Wizard(SCENES.TEST)
export class TestScene {
  constructor(
    private sender: TelegramSender,
    private wiki: WikiService,
  ) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.wizard.next();

    await ctx.sendMessage(
      `Send me date as  ${dayjs().format(dataFormat)} format`,
    );
  }

  @On('text')
  @WizardStep(2)
  async selectDate(@Ctx() ctx: Context, @Message('text') msg: string) {
    const date = dayjs(msg, dataFormat, true);

    if (!date.isValid()) {
      throw new TelegrafException('date not valid');
    }

    ctx.wizard.state['date'] = msg;
    ctx.wizard.next();

    await ctx.sendMessage('What we will testing?', {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('Featured Image', 'type-tfi')],
          [Markup.button.callback('Featured Article', 'type-tfa')],
          [Markup.button.callback('On This Day', 'type-on_this_day')],
        ],
      },
    });
  }

  @Action(/type-(\w+)/)
  @WizardStep(3)
  async onType(@Ctx() ctx: Context) {
    const type = ctx.match.at(1);

    await ctx.answerCbQuery();

    ctx.wizard.state['type'] = type;

    await ctx.editMessageText('Choose lang', {
      reply_markup: {
        inline_keyboard: [
          WIKI_LANGUAGES.map((lang) =>
            Markup.button.callback(lang, `lang-${lang}`),
          ),
        ],
      },
    });

    ctx.wizard.next();
  }

  @WizardStep(4)
  @Action(/lang-(\w\w)/)
  async onTest(@Ctx() ctx: Context, @CurrentChat() chat: Chat) {
    const type: string = ctx.wizard.state['type'];
    const dateString: string = ctx.wizard.state['date'];
    const date = dayjs(dateString, dataFormat, true);
    const lang = ctx.match.at(1)! as WikiLanguage;
    const params = {
      lang,
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    };

    await ctx.editMessageText('Loading...');

    await ctx.scene.leave();

    const featuredContent = await this.wiki.getContent(params);

    await ctx.deleteMessage();
    await ctx.answerCbQuery();

    await I18nContext.create(lang, async () => {
      switch (type) {
        case 'tfi':
          await this.sender.sendFeaturedImage(chat.id, featuredContent.image!);
          break;
        case 'tfa':
          await this.sender.sendFeaturedArticle(chat.id, featuredContent.tfa!);
          break;
        case 'on_this_day':
          await this.sender.sendOnThisDay(
            chat.id,
            featuredContent.onthisday!.at(5)!,
          );
          break;
      }
    });
  }
}
