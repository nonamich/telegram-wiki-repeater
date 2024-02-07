import { NestFactory } from '@nestjs/core';

import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { Utils } from '@repo/shared';

import { AppModule } from '~/modules/app.module';

import {
  EventHandlerLambda,
  EventHandlerEventBridge,
} from './interfaces/app.interface';
import { TelegramChatService } from './modules/telegram/telegram.chat.service';
import { BOT_NAME } from './modules/telegram/telegram.constants';

if (!Utils.isLambda) {
  handler();
}

export async function handler(
  event?: EventHandlerLambda | EventHandlerEventBridge,
) {
  const app = await NestFactory.createApplicationContext(AppModule);

  if (!event) {
    return;
  }

  if ('body' in event) {
    const bot = app.get<Telegraf>(getBotToken(BOT_NAME));

    await bot.handleUpdate(event.body);
  } else if ('handler' in event) {
    const chatService = app.get(TelegramChatService);

    await chatService.informChats();
    await app.close();
  }
}
