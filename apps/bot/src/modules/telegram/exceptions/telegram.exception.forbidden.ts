import { TelegrafException } from 'nestjs-telegraf';

export class TelegramExceptionForbidden extends TelegrafException {
  constructor() {
    super('Only for admin!');
  }
}
