import { Module } from '@nestjs/common';

import { WikiModule } from '~/modules/wiki/wiki.module';

import { TestScene } from './scenes/test.scene';
import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramScheduler } from './telegram.scheduler';
import { TelegramSender } from './telegram.sender';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramUpdate } from './telegram.update';
import { TelegramViews } from './views/telegram.view';

@Module({
  imports: [WikiModule],
  providers: [
    TestScene,
    TelegramUpdate,
    TelegramSender,
    TelegramViews,
    TelegramSessionStore,
    TelegramOptionsFactory,
    TelegramScheduler,
  ],
  exports: [TelegramSessionStore],
})
export class TelegramModule {}
