import { Scenes } from 'telegraf';

import {
  WikiArticle,
  WikiFeaturedImage,
  WikiMostReadArticle,
  WikiNews,
  WikiOnThisDay,
} from '~/modules/wiki/interfaces';

import { ChatId } from '../telegram.types';

interface BaseContext {
  match: RegExpMatchArray;
}

export interface Context extends Scenes.SceneContext, BaseContext {}

export interface TelegramSendByType {
  sendMostReadArticle(
    chatId: ChatId,
    article: WikiMostReadArticle,
  ): Promise<void>;
  sendFeaturedArticle(chatId: ChatId, article: WikiArticle): Promise<void>;
  sendFeaturedImage(chatId: ChatId, image: WikiFeaturedImage): Promise<void>;
  sendNews(chatId: ChatId, news: WikiNews): Promise<void>;
  sendOnThisDay(chatId: ChatId, event: WikiOnThisDay): Promise<void>;
}
