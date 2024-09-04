import { WIKI_LANGUAGES } from '../wiki.constants';
import { WikiFeaturedImage } from './featured';
import { WikiNews } from './news';
import { WikiOnThisDay } from './on-this-day';

export type WikiLanguage = (typeof WIKI_LANGUAGES)[number];

export type WikiArticle = {
  content_urls: {
    desktop: {
      page: string;
    };
  };
  description?: string;
  extract_html: string;
  originalimage?: WikiImage;
  thumbnail?: WikiImage;
  pageid: number;
  titles: {
    normalized: string;
  };
};

export type WikiImage = {
  source: string;
  width: number;
  height: number;
};

export type ArticleType = 'tfi' | 'tfa' | 'news' | 'onthisday';

export type OrderOfArticles = Array<
  | ['tfi', WikiFeaturedImage]
  | ['tfa', WikiArticle]
  | ['onthisday', WikiOnThisDay]
  | ['news', WikiNews]
>;

export type WikiSiteData = {
  pathnames: {
    currentEvents: string;
    featuredArticles: string;
    featuredPictures: string;
  };
  isRTL?: true;
  donateURL: string;
};
