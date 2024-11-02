import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { TelegramForbiddenException } from '../exceptions/telegram-forbidden.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  adminId: number;

  constructor(readonly configService: ConfigService) {
    this.adminId = +this.configService.getOrThrow<string>('TELEGRAM_ADMIN_ID');
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context).getContext<Context>();
    const isAdmin = this.adminId === ctx.from?.id;

    if (!isAdmin) {
      throw new TelegramForbiddenException();
    }

    return true;
  }
}
