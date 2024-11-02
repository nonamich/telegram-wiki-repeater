import { TelegrafException } from 'nestjs-telegraf';

export class TelegramForbiddenException extends TelegrafException {
  name = TelegramForbiddenException.name;

  constructor() {
    super('Only for admin!');
  }
}
