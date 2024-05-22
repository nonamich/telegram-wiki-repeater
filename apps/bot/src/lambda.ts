import { INestApplicationContext } from '@nestjs/common';

import { Update } from '@telegraf/types';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { createApp } from './app';
import { EventHandler, EventHandlerLambda } from './interfaces/app.interface';
// import { TelegramChatService } from './modules/telegram.old/telegram.chat.service';

let app: INestApplicationContext;

export async function handler(event?: EventHandler) {
  if (!app) {
    app = await createApp();
  }

  if (!event) {
    return;
  }

  await lambdaEventController(event);
}

async function lambdaEventController(event: EventHandler) {
  if ('body' in event) {
    sendReplay(event);
  } else if ('handler' in event) {
    await scheduledSending();
  }
}

async function sendReplay(event: EventHandlerLambda) {
  const update = JSON.parse(event.body) as Update;
  const bot = app.get<Telegraf>(getBotToken());

  await bot.handleUpdate(update);
}

async function scheduledSending() {
  // const chatService = app.get(TelegramChatService);
  // return chatService.informChats();
}
