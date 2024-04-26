import { UseGuards } from '@nestjs/common';

import { Update, Start, Ctx } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

import { I18nService } from '~/modules/i18n/i18n.service';

import { AdminGuard } from './guards/admin.guard';

@Update()
@UseGuards(AdminGuard)
export class TelegramUpdate {
  constructor(readonly i18nService: I18nService) {}

  @Start()
  async onStart(@Ctx() ctx: Scenes.SceneContext) {
    await Promise.all([
      this.i18nService.runWithContext('uk', async () => {
        await this.sayHi(ctx);
      }),
      this.i18nService.runWithContext('en', async () => {
        await this.sayHi(ctx);
      }),
      this.i18nService.runWithContext('tr', async () => {
        await this.sayHi(ctx);
      }),
    ]);
  }

  async sayHi(ctx: Scenes.SceneContext) {
    const i18n = this.i18nService.currentContext();

    await ctx.sendMessage({
      text: `${i18n.language}: ${i18n.t('views')}`,
    });
  }
}
