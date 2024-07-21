import { WIKI_LANGUAGES } from '../wiki.constants';
import { WikiFeaturedImage } from './featured';
import { WikiNews } from './news';
import { WikiOnThisDay } from './on-this-day';

export type WikiLanguage = (typeof WIKI_LANGUAGES)[number];

export interface WikiArticle {
  content_urls: ContentUrls;
  description?: string;
  extract_html: string;
  originalimage?: WikiImage;
  thumbnail?: WikiImage;
  pageid: number;
  titles: Titles;
}

export interface WikiImage {
  source: string;
  width: number;
  height: number;
}

interface ContentUrls {
  desktop: ContentUrl;
  mobile: ContentUrl;
}

interface ContentUrl {
  page: string;
}

interface Titles {
  normalized: string;
}

export type ArticleType = 'tfi' | 'tfa' | 'news' | 'onthisday';

export type OrderOfArticle<T extends ArticleType, D extends object> = [T, D];

export type OrderOfArticles = Array<
  | OrderOfArticle<'tfi', WikiFeaturedImage>
  | OrderOfArticle<'tfa', WikiArticle>
  | OrderOfArticle<'news', WikiNews>
  | OrderOfArticle<'onthisday', WikiOnThisDay>
>;

export type WikiSiteData = {
  currentEvents: string;
  featuredArticles: string;
  featuredPictures: string;
};
