import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WikiModule } from '~/modules/wiki/wiki.module';

import { ImagesModule } from '../images/images.module';
import { ChannelScene } from './scenes/channel.scene';
import { TestScene } from './scenes/test.scene';
import { TelegramImages } from './telegram.images';
import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramScheduler } from './telegram.scheduler';
import { TelegramSender } from './telegram.sender';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramSkipper } from './telegram.skipper';
import { TelegramUpdate } from './telegram.update';
import { TelegramViews } from './views/telegram.view';

@Module({
  imports: [WikiModule, ImagesModule, HttpModule],
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
    TelegramImages,
  ],
  exports: [TelegramSessionStore],
})
export class TelegramModule {}
