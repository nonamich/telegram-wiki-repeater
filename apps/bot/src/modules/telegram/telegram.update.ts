import { Update, Start, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Chat } from 'telegraf/types';

import { I18nContext } from '../i18n/i18n.context';
import { WikiService } from '../wiki/wiki.service';
import { imageTestData } from './data/image.test.data';
import { newsTestData } from './data/news.test.data';
import { CurrentChat } from './decorators/current-chat.decorator';
import { COMMANDS } from './telegram.enums';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly tg: TelegramService,
    private readonly wiki: WikiService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.telegram.setMyCommands([
      {
        command: COMMANDS.TEST_IMAGE,
        description: 'Test Featured Image',
      },
    ]);

    await ctx.sendMessage(`Hello Admin! ${ctx.from?.first_name}`);
  }

  @Command(COMMANDS.TEST_IMAGE)
  async onTestImage(@CurrentChat() chat: Chat) {
    I18nContext.create('en', async () => {
      await this.tg.sendFeaturedImage(chat.id, imageTestData);
    });
  }

  @Command(COMMANDS.TEST_NEWS)
  async onTestNews(@CurrentChat() chat: Chat) {
    I18nContext.create('en', async () => {
      await this.tg.sendNews(chat.id, newsTestData);
    });
  }
}
