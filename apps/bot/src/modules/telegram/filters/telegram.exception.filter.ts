import { Catch, ExceptionFilter, Logger } from '@nestjs/common';

import { TelegrafArgumentsHost, TgArgumentsHost } from 'nestjs-telegraf';

import { Utils } from '@repo/shared';

import { TelegramExceptionForbidden } from '~/modules/telegram/exceptions/telegram.exception.forbidden';

import { Context } from '../telegram.types';

@Catch()
export class TelegramExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: TgArgumentsHost) {
    if (exception instanceof TelegramExceptionForbidden) {
      const telegrafHost = TelegrafArgumentsHost.create(host);
      const ctx = telegrafHost.getContext<Context>();

      await ctx.reply(exception.message);
    }

    Logger.error(exception, Utils.isDev ? exception.stack : undefined);
  }
}
