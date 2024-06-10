import { ArticleType } from '~/modules//wiki/interfaces';

export type StringOrNumber = number | string;

export type ChatId = StringOrNumber;

export type SkipParams = {
  ids: StringOrNumber | StringOrNumber[];
  chatId: ChatId;
  type: ArticleType;
  expireInSec?: number;
};
