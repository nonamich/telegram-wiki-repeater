import { Injectable } from '@nestjs/common';

import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramSender {
  constructor(@InjectBot() private bot: Telegraf) {}

  async sendImage(chatId: number, url: string, caption?: string) {
    await this.bot.telegram.sendPhoto(
      chatId,
      {
        url,
      },
      {
        ...this.getDefaultExtra(),
        caption,
      },
    );
  }

  async sendArticle(chatId: number, url: string, caption?: string) {}

  getDefaultExtra(): ExtraReplyMessage {
    return {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };
  }
}
