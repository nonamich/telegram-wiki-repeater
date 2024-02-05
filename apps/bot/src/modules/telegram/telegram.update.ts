import { UseFilters } from '@nestjs/common';

import { Update, Start, Ctx, Command } from 'nestjs-telegraf';

import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { SceneContext } from './interfaces/telegraf.interface';
import { COMMANDS, SCENE_IDS } from './telegram.constants';
import { TelegramService } from './telegram.service';

@Update()
@UseFilters(new TelegrafExceptionFilter())
export class TelegramUpdate {
  constructor(private readonly tg: TelegramService) {}

  @Start()
  async onStart(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(SCENE_IDS.GREETER);
  }

  @Command(COMMANDS.LANG)
  async onLang(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(SCENE_IDS.GREETER);
  }

  @Command(COMMANDS.SHOW)
  async onShow(@Ctx() ctx: SceneContext) {
    await this.tg.run(ctx);
  }
}
