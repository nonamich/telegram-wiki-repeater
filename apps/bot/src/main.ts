import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Update } from '@telegraf/types';
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

let app: INestApplicationContext;

if (!Utils.isLambda) {
  handler();
}

export async function handler(
  event?: EventHandlerLambda | EventHandlerEventBridge,
) {
  if (!app) {
    app = await NestFactory.createApplicationContext(AppModule);
  }

  if (!event) {
    return;
  }

  if ('body' in event) {
    const update = JSON.parse(event.body) as Update;
    const bot = app.get<Telegraf>(getBotToken(BOT_NAME));

    await bot.handleUpdate(update);
  } else if ('handler' in event) {
    const chatService = app.get(TelegramChatService);

    return chatService.informChats();
  }
}
