export const WIKI_BASE_URL = 'https://api.wikimedia.org/feed/v1/wikipedia';
export const WIKI_CACHE_ENCODING: BufferEncoding = 'base64';

export const WIKI_LANGUAGES = [
  'en',
  'hi',
  'id',
  'pt',
  'ar',
  'vi',
  'es',
  'uk',
  'tr',
] as const;

export const WIKI_RETRY_MS = 10000;
