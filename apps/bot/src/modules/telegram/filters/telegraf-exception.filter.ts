import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { TelegrafArgumentsHost, TelegrafException } from 'nestjs-telegraf';
import { TelegramError } from 'telegraf';

import { SceneContext } from '../interfaces/telegraf.interface';

@Catch(TelegramError)
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(
    exception: TelegrafException,
    host: ArgumentsHost,
  ): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<SceneContext>();

    console.error(exception);

    await ctx.replyWithHTML(`<b>Error</b>: something wrong!`);
  }
}
