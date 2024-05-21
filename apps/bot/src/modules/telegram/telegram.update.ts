import { Update, Start, Ctx, Command } from 'nestjs-telegraf';

import { WikiService } from '../wiki/wiki.service';
import { Context } from './interfaces/telegram.interface';
import { COMMANDS, SCENE_IDS } from './telegram.enums';

@Update()
export class TelegramUpdate {
  constructor(private readonly wiki: WikiService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.telegram.deleteMyCommands();
    await ctx.telegram.setMyCommands([
      {
        command: COMMANDS.TEST,
        description: 'Enter to Test scene',
      },
    ]);

    await ctx.reply(`Hello Admin! ${ctx.from?.first_name}`);
  }

  @Command(COMMANDS.TEST)
  async onTest(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENE_IDS.TEST);
  }
}
