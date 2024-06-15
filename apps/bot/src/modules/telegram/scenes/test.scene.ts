import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Chat } from 'telegraf/types';

import { I18nContext } from '~/modules/i18n/i18n.context';
import { WikiLanguage } from '~/modules/wiki/types';
import { WikiService } from '~/modules/wiki/wiki.service';

import { CurrentChat } from '../decorators/current-chat.decorator';
import { SCENES } from '../telegram.enums';
import { TelegramSender } from '../telegram.sender';
import { Context } from '../telegram.types';

@Scene(SCENES.TEST)
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
              callback_data: 'test-on_this_day',
            },
          ],
        ],
      },
    });
  }

  @Action(/test-(\w+)/)
  async onTest(@Ctx() ctx: Context, @CurrentChat() chat: Chat) {
    await ctx.deleteMessage();
    await ctx.scene.leave();

    const lang: WikiLanguage = 'uk';
    const params = this.wiki.getFeaturedRequestParams(lang);
    const featuredContent = await this.wiki.getFeaturedContent({
      ...params,
      day: 14,
    });
    const type = ctx.match.at(1)!;

    await I18nContext.create(lang, async () => {
      switch (type) {
        case 'tfi':
          await this.sender.sendFeaturedImage(chat.id, featuredContent.image!);

          break;
        case 'tfa':
          await this.sender.sendFeaturedArticle(chat.id, featuredContent.tfa!);

          break;

        case 'news':
          await this.sender.sendNews(chat.id, featuredContent.news!.at(1)!);

          break;
        case 'mostread':
          await this.sender.sendMostReadArticle(
            chat.id,
            featuredContent.mostread!.at(0)!,
          );

          break;
        case 'on_this_day':
          await this.sender.sendOnThisDay(
            chat.id,
            featuredContent.onthisday!.at(13)!,
          );

          break;
      }
    });
  }
}
