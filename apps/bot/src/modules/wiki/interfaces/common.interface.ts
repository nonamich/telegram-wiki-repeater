import { WIKI_LANGUAGES } from '../wiki.constants';
import { WikiFeaturedImage } from './featured.interface';
import { WikiMostReadArticle } from './most-read.interface';
import { WikiNews } from './news.interface';
import { WikiOnThisDay } from './on-this-day.interface';

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

export type ArticleType = 'tfi' | 'tfa' | 'mostread' | 'news' | 'onthisday';

type OrderOfArticle<T extends ArticleType, D extends object> = [T, D];

export type OrderOfArticles = Array<
  | OrderOfArticle<'tfi', WikiFeaturedImage>
  | OrderOfArticle<'tfa', WikiArticle>
  | OrderOfArticle<'mostread', WikiMostReadArticle>
  | OrderOfArticle<'news', WikiNews>
  | OrderOfArticle<'onthisday', WikiOnThisDay>
>;
