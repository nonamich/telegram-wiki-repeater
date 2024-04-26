import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TelegrafExecutionContext } from 'nestjs-telegraf';

import { TelegramExceptionForbidden } from '../exceptions/telegram.exception.forbidden';
import { Context } from '../interfaces/telegraf.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN_IDS: number[] = [];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    if (!from) {
      throw new TelegramExceptionForbidden();
    }

    const isAdmin = this.ADMIN_IDS.includes(from.id);

    if (!isAdmin) {
      throw new TelegramExceptionForbidden();
    }

    return true;
  }
}
