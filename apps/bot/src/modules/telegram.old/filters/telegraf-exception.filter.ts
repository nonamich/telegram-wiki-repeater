import { Catch, ExceptionFilter } from '@nestjs/common';

import { TelegrafException } from 'nestjs-telegraf';
import { TelegramError } from 'telegraf';

@Catch(TelegramError)
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(exception: TelegrafException): Promise<void> {
    console.error(exception);
  }
}
