import { WIKI_LANGUAGES } from '../wiki.constants';

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
