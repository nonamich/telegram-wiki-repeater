import { WikiArticle, WikiImageFeatured } from '~/modules/wiki/interfaces';

import { TelegramLanguage } from '../i18n/telegram.i18n.interface';

export interface WithLang {
  lang: TelegramLanguage;
}

export interface WithChatId {
  chatId: number;
}

export interface WithTags {
  tags: string[];
}

export interface WithHeader {
  header: string;
}

export interface WithLinks {
  links?: Array<{ text: string; href: string }>;
}

export interface WithExpire {
  expireInSec?: number;
}

export interface WithSource {
  source?: string;
}

export interface BaseParams extends WithLang, WithHeader, WithChatId {}

export interface TgWikiImageParams extends BaseParams {
  image: WikiImageFeatured;
}

export interface TgWikiArticleParams
  extends BaseParams,
    WithTags,
    WithExpire,
    WithLinks {
  article: WikiArticle;
}

export interface HTMLParams
  extends WithLang,
    WithTags,
    WithHeader,
    WithLinks,
    WithSource {
  content: string;
  maxLength?: number;
}

export interface ArticleHTMLParams extends HTMLParams {
  title: string;
  url: string;
  description?: string;
}

export interface SkipParams extends WithLang, WithChatId, WithExpire {
  id: number | string;
}

export interface SetSkipParams extends SkipParams, WithExpire {
  id: number | string;
}
