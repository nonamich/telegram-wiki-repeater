import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { TelegrafArgumentsHost, TelegrafException } from 'nestjs-telegraf';

import { Context } from '../telegram.types';

@Catch(TelegrafException)
export class TelegramExceptionFilter extends BaseExceptionFilter {
  // 2
  async catch(exception: TelegrafException, host: ArgumentsHost) {
    Logger.error(exception.message);

    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    await ctx.replyWithHTML(`<b>Error</b>: ${exception.message}`);
  }
}
