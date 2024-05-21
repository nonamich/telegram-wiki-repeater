import { Module } from '@nestjs/common';

import { WikiModule } from '~/modules/wiki/wiki.module';

import { TestScene } from './scenes/test.scene';
import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramSender } from './telegram.sender';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramUpdate } from './telegram.update';
import { TelegramViews } from './views/telegram.view';

@Module({
  imports: [WikiModule],
  providers: [
    TelegramUpdate,
    TelegramSender,
    TelegramViews,
    TelegramSessionStore,
    TelegramOptionsFactory,
    TestScene,
  ],
  exports: [TelegramSessionStore],
})
export class TelegramModule {}
