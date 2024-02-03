import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { TelegrafArgumentsHost, TelegrafException } from 'nestjs-telegraf';
import { TelegramError } from 'telegraf';

import { MyContext } from '../interfaces/telegraf.interface';

@Catch(TelegramError)
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(
    exception: TelegrafException,
    host: ArgumentsHost,
  ): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<MyContext>();

    await ctx.replyWithHTML(`<b>Error</b>: something wrong!`);
  }
}
