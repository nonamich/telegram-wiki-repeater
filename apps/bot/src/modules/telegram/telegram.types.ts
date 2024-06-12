import { Scenes } from 'telegraf';

import { ArticleType } from '~/modules/wiki/types';

export type StringOrNumber = number | string;

export type ChatId = StringOrNumber;

export type SkipParams = {
  ids: StringOrNumber | StringOrNumber[];
  chatId: ChatId;
  type: ArticleType;
  lang: string;
  expireInSec?: number;
};

interface BaseContext {
  match: RegExpMatchArray;
}

export interface Context extends Scenes.SceneContext, BaseContext {}
