import {
  WikiLanguage,
  WikiArticle,
  ArticleSource,
  WikiImageFeatured,
} from '~/modules/wiki/interfaces';

interface WithLang {
  lang: WikiLanguage;
}

export interface TelegramServiceParams extends WithLang {
  chatId: number;
}

export interface TelegramFeaturedWikiImageParams extends TelegramServiceParams {
  image: WikiImageFeatured;
}

export interface TelegramWikiArticleParams extends TelegramServiceParams {
  article: WikiArticle;
  type: ArticleSource;
}

export interface ArticleHTMLParams extends WithLang {
  title: string;
  url: string;
  content: string;
  description?: string;
  beforeTitle?: string;
}
