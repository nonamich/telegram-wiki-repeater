import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';

import { DBService } from '~/modules/db/db.service';

import { SCENES } from '../telegram.enums';
import { TelegramScheduler } from '../telegram.scheduler';
import { Context } from '../telegram.types';

@Scene(SCENES.CHANNEL)
export class ChannelScene {
  constructor(
    readonly db: DBService,
    readonly scheduler: TelegramScheduler,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const channels = await this.db.getAllChannels();

    await ctx.sendMessage('Choose Channel', {
      reply_markup: {
        inline_keyboard: channels.map(({ id, lang, isDev }) => {
          return [
            {
              text: `Lang: ${lang}, isDev: ${isDev}, ${id}`,
              callback_data: `channel-${id}`,
            },
          ];
        }),
      },
    });
  }

  @Action(/channel-(.+)/)
  async onTest(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx.scene.leave();

    const id = ctx.match.at(1)!;
    const channel = await this.db.getChannelById(id);

    if (!channel) {
      return;
    }

    await this.scheduler.executeWithI18nContext(channel.id, channel.lang);
  }
}
