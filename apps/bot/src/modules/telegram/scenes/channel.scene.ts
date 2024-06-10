import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';

import { DBService } from '~/modules/db/db.service';

import { Context } from '../interfaces/telegram.interface';
import { SCENES } from '../telegram.enums';
import { TelegramScheduler } from '../telegram.scheduler';

@Scene(SCENES.CHANNEL)
export class ChannelScene {
  constructor(
    readonly db: DBService,
    readonly scheduler: TelegramScheduler,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    const channels = await this.db.getDevChannels();

    await ctx.sendMessage('Choose Channel', {
      reply_markup: {
        inline_keyboard: [
          channels.map(({ id, lang }) => {
            return {
              text: `${id} ${lang}`,
              callback_data: `channel-${id}`,
            };
          }),
        ],
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

    await this.scheduler.executeWithContext(channel.id, channel.lang);
  }
}
