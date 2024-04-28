import { Injectable } from '@nestjs/common';

import { WikiImageFeatured, WikiNews } from '../wiki/interfaces';
import { TelegramSender } from './telegram.sender';
import { TelegramViews } from './views/telegram.view';

@Injectable()
export class TelegramService {
  constructor(
    private readonly sender: TelegramSender,
    private readonly views: TelegramViews,
  ) {}

  async sendNews(chatId: number, news: WikiNews) {
    const html = this.views.renderNews({ news });

    await this.sender.sendNews(chatId);
  }

  async sendFeaturedImage(chatId: number, image: WikiImageFeatured) {
    const caption = this.views.renderFeaturedImage({ image });

    await this.sender.sendImage(chatId, image.thumbnail.source, caption);
  }
}
