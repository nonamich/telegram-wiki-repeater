import { Module } from '@nestjs/common';

import { WikiModule } from '~/modules/wiki/wiki.module';

import { ChannelScene } from './scenes/channel.scene';
import { TestScene } from './scenes/test.scene';
import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramScheduler } from './telegram.scheduler';
import { TelegramSender } from './telegram.sender';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramUpdate } from './telegram.update';
import { TelegramSkipper } from './with-i18n-context/telegram.skipper';
import { TelegramViews } from './with-i18n-context/views/telegram.view';

@Module({
  imports: [WikiModule],
  providers: [
    TelegramOptionsFactory,
    TelegramScheduler,
    TelegramSender,
    TelegramSessionStore,
    TelegramSkipper,
    TelegramUpdate,
    TelegramViews,
    TestScene,
    ChannelScene,
  ],
  exports: [TelegramSessionStore],
})
export class TelegramModule {}
