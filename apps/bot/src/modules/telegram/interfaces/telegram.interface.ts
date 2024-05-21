import { Scenes } from 'telegraf';

import { Tag } from '../views/telegram.views.type';

export interface TelegramSendArticleList {
  chatId: number;
  title: string;
  list: string[];
  tags: Tag[];
}

interface BaseContext {
  match: RegExpMatchArray;
}

export interface Context extends Scenes.SceneContext, BaseContext {}
