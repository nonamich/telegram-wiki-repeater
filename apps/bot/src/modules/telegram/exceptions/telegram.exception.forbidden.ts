import { TelegrafException } from 'nestjs-telegraf';

export class TelegramExceptionForbidden extends TelegrafException {
  name = TelegramExceptionForbidden.name;

  constructor() {
    super('Only for admin!');
  }
}
