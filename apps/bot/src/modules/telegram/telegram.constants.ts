export const CYCLES_RUN = 16 as const;

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

export enum SCENE_IDS {
  GREETER = 'greeter',
}

export enum COMMANDS {
  SHOW = 'show',
  LANG = 'lang',
}

export const MAX_CONTENT_MESSAGE = 3800;

export const MAX_CONTENT_CAPTION = 900;

export const BOT_NAME = 'wiki_repeater_bot';
