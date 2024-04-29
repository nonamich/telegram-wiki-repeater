import { WIKI_LANGUAGES } from '../wiki.constants';

export type WikiLanguage = (typeof WIKI_LANGUAGES)[number];

export interface WikiArticle {
  content_urls: ContentUrls;
  description?: string;
  dir: string;
  displaytitle: string;
  extract_html: string;
  extract: string;
  lang: string;
  normalizedtitle: string;
  originalimage?: WikiImage;
  thumbnail?: WikiImage;
  pageid: number;
  revision: string;
  tid: string;
  timestamp: string;
  title: string;
  titles: Titles;
  type: string;
  wikibase_item: string;
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
  revisions: string;
  edit: string;
  talk: string;
}

interface Titles {
  canonical: string;
  normalized: string;
  display: string;
}
