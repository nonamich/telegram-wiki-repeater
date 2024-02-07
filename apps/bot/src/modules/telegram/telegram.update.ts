import { UseFilters } from '@nestjs/common';

import { Update, Start, Ctx, Command } from 'nestjs-telegraf';

import { TelegrafExceptionFilter } from './filters/telegraf-exception.filter';
import { SceneContext } from './interfaces/telegraf.interface';
import { TelegramChatService } from './telegram.chat.service';
import { COMMANDS, SCENE_IDS } from './telegram.enums';
import { TelegramService } from './telegram.service';

@Update()
@UseFilters(new TelegrafExceptionFilter())
export class TelegramUpdate {
  constructor(
    private readonly tg: TelegramService,
    private readonly chatService: TelegramChatService,
  ) {}

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
    const { chatId, lang } = this.chatService.getChatInfoFromContext(ctx);

    await this.tg.inform(chatId, lang);
  }
}
