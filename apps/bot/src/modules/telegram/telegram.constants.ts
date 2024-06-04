import { HOUR_IN_SEC } from '../redis/redis.constants';

export const MAX_CONTENT_LENGTH = 800;
export const TELEGRAM_MAX_IMAGE_SIZE = 3000;
export const TELEGRAM_MIN_IMAGE_SIZE = 200;
export const TELEGRAM_ALLOWED_TAGS = [
  'b',
  'i',
  'u',
  's',
  'b',
  'a',
  'tg-emoji',
  'code',
  'pre',
  'strong',
  'em',
  'ins',
  'strike',
  'tg-spoiler',
];
export const TELEGRAM_TAG_DANGEROUSLY_HTML = 'body';
export const TELEGRAM_TURN_ON_HOUR = 9;
export const TELEGRAM_TURN_OFF_HOUR = 23;
export const TELEGRAM_MAX_POST_PER_TIME = HOUR_IN_SEC;
