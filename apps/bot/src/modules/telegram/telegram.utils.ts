import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export abstract class TelegramUtils {
  static getDefaultExtra() {
    const extra = {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;

    return extra;
  }
}
