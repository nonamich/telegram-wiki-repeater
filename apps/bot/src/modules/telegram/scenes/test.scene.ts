import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Chat } from 'telegraf/types';

import { I18nContext } from '~/modules/i18n/i18n.context';
import { WikiService } from '~/modules/wiki/wiki.service';

import { newsTestData, tfaTestData, tfiTestData } from '../data';
import { CurrentChat } from '../decorators/current-chat.decorator';
import { Context } from '../interfaces/telegram.interface';
import { SCENE_IDS } from '../telegram.enums';
import { TelegramService } from '../telegram.service';

@Scene(SCENE_IDS.TEST)
export class TestScene {
  constructor(
    private tg: TelegramService,
    private wiki: WikiService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.sendMessage('Enter Test Data', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Featured Image',
              callback_data: 'test-tfi',
            },
            {
              text: 'Featured Article',
              callback_data: 'test-tfa',
            },
            {
              text: 'News',
              callback_data: 'test-news',
            },
          ],
          [
            {
              text: 'Most Read',
              callback_data: 'test-most-read',
            },
          ],
        ],
      },
    });
  }

  @Action(/test-(\w+)/)
  async onTest(@Ctx() ctx: Context, @CurrentChat() chat: Chat) {
    const type = ctx.match.at(1)!;

    await ctx.deleteMessage();

    await I18nContext.create('en', async () => {
      switch (type) {
        case 'tfi':
          await this.tg.sendFeaturedImage(chat.id, tfiTestData);
          break;
        case 'tfa':
          await this.tg.sendFeaturedArticle(chat.id, tfaTestData);
          break;
        case 'news':
          await this.tg.sendNews(chat.id, newsTestData);
          break;
        case 'most-read':
          // await this.tg.sendNews(chat.id, newsTestData);
          const b = await this.wiki.getFeaturedContent({
            ...this.wiki.getFeaturedRequestParams('en'),
            day: 30,
            month: 4,
          });

          b;

          break;
      }
    });

    await ctx.scene.leave();
  }
}
