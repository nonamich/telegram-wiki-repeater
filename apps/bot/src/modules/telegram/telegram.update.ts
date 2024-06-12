import { Update, Start, Ctx, Command } from 'nestjs-telegraf';

import { COMMANDS, SCENES } from './telegram.enums';
import { Context } from './telegram.types';

@Update()
export class TelegramUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.telegram.deleteMyCommands();
    await ctx.telegram.setMyCommands([
      {
        command: COMMANDS.TEST,
        description: 'Enter to Test scene',
      },
      {
        command: COMMANDS.CHANNEL,
        description: 'Enter to Channel scene',
      },
    ]);

    await ctx.reply(`Hello Admin! ${ctx.from?.first_name}`);
  }

  @Command(COMMANDS.TEST)
  async onTest(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENES.TEST);
  }

  @Command(COMMANDS.CHANNEL)
  async onChannel(@Ctx() ctx: Context) {
    await ctx.scene.enter(SCENES.CHANNEL);
  }
}
