import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { firstValueFrom } from 'rxjs';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { ImagesService } from '~/modules/images/images.service';
import {
  WikiFeaturedImage,
  WikiOnThisDay,
  WikiArticle,
} from '~/modules/wiki/types';

import { TELEGRAM_MAX_ON_THIS_DAY_TEXT } from './telegram.constants';
import { TelegramImages } from './telegram.images';
import { ChatId } from './telegram.types';
import { TelegramViews } from './views/telegram.view';

@Injectable()
export class TelegramSender {
  constructor(
    @InjectBot() readonly bot: Telegraf,
    readonly views: TelegramViews,
    readonly telegramImagesService: TelegramImages,
    readonly imagesService: ImagesService,
    readonly httpService: HttpService,
  ) {}

  async sendFeaturedArticle(chatId: ChatId, article: WikiArticle) {
    const html = await this.views.renderFeaturedArticle({ article });
    const image =
      await this.telegramImagesService.getImageURLByArticle(article);

    await this.sendPost(chatId, html, image);
  }

  async sendFeaturedImage(chatId: ChatId, image: WikiFeaturedImage) {
    const caption = await this.views.renderFeaturedImage({ image });
    const imageURL = await this.telegramImagesService.getResizedURL(
      image.thumbnail,
    );

    await this.sendPost(chatId, caption, imageURL);
  }

  async sendOnThisDay(chatId: ChatId, event: WikiOnThisDay) {
    if (event.text.length >= TELEGRAM_MAX_ON_THIS_DAY_TEXT) {
      event.pages.splice(0);
    }

    const image = await this.telegramImagesService.getFirstImageFromArticles(
      event.pages,
    );
    const html = await this.views.renderOnThisDay({
      event,
      pageIdWithImage: image?.pageId,
    });

    await this.sendPost(chatId, html, image?.url);
  }

  async sendPost(chatId: ChatId, html: string, photoURL?: string) {
    const extra = this.getDefaultExtra();

    if (photoURL) {
      const { data: source } = await firstValueFrom(
        this.httpService.get<NodeJS.ReadableStream>(photoURL, {
          responseType: 'stream',
        }),
      );

      await this.bot.telegram.sendPhoto(
        chatId,
        {
          source,
        },
        {
          ...extra,
          caption: html,
        },
      );

      return;
    }

    await this.bot.telegram.sendMessage(chatId, html, extra);
  }

  getDefaultExtra() {
    return {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    } satisfies ExtraReplyMessage;
  }
}
