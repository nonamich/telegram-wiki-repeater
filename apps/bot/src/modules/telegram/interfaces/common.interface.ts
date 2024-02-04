import { WikiArticle, WikiImageFeatured } from '~/modules/wiki/interfaces';

import { TelegramLanguage } from '../i18n/telegram.i18n.interface';

export interface WithLang {
  lang: TelegramLanguage;
}

export interface WithTags {
  tags: string[];
}

export interface WithBeforeTitle {
  header: string;
}

export interface BaseParams extends WithLang, WithBeforeTitle {
  chatId: number;
}

export interface TgWikiImageParams extends BaseParams {
  image: WikiImageFeatured;
}

export interface TgWikiArticleParams extends BaseParams, WithTags {
  article: WikiArticle;
}

export interface HTMLParams extends WithLang, WithTags, WithBeforeTitle {
  content: string;
}

export interface ArticleHTMLParams extends HTMLParams {
  title: string;
  url: string;
  description?: string;
}
