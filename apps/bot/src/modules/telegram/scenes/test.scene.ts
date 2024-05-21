import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Chat } from 'telegraf/types';

import { I18nContext } from '~/modules/i18n/i18n.context';
import { WikiService } from '~/modules/wiki/wiki.service';

import { CurrentChat } from '../decorators/current-chat.decorator';
import { Context } from '../interfaces/telegram.interface';
import { SCENE_IDS } from '../telegram.enums';
import { TelegramSender } from '../telegram.sender';

@Scene(SCENE_IDS.TEST)
export class TestScene {
  constructor(
    private sender: TelegramSender,
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
              callback_data: 'test-mostread',
            },
            {
              text: 'On This Day',
              callback_data: 'on_this_day',
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

    await ctx.scene.leave();

    const featuredContent = await this.wiki.getFeaturedContent({
      ...this.wiki.getFeaturedRequestParams('en'),
    });

    await I18nContext.create('en', async () => {
      switch (type) {
        case 'tfi':
          await this.sender.sendFeaturedImage(chat.id, featuredContent.image!);

          break;
        case 'tfa':
          await this.sender.sendFeaturedArticle(chat.id, featuredContent.tfa!);

          break;

        case 'news':
          await this.sender.sendNews(chat.id, featuredContent.news!);

          break;
        case 'mostread':
          await this.sender.sendMostReadArticle(
            chat.id,
            featuredContent.mostread!.articles.at(0)!,
          );

          break;
        case 'on_this_day':
          // await this.sender.sendOnThisDay(chat.id, featuredContent.onthisday!);

          break;
      }
    });
  }
}
