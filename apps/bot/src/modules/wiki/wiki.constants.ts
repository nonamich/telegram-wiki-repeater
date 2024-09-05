import { SUPPORTED_LANGUAGES } from '@repo/shared';

export const WIKI_BASE_URL = 'https://api.wikimedia.org/feed/v1/wikipedia';
export const WIKI_CACHE_ENCODING: BufferEncoding = 'base64';
export const WIKI_LANGUAGES = SUPPORTED_LANGUAGES;
export const WIKI_RETRY_MS = 5000;
export const WIKI_MAX_PAGE_ON_THIS_DAY = 4;
