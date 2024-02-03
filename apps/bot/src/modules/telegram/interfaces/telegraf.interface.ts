import type { i18n } from 'i18next';
import type { Context as ContextTelegraf } from 'telegraf';

interface SessionData {
  locale?: string;
}

export interface MyContext extends ContextTelegraf {
  i18next: i18n;
  session: SessionData;
  match?: RegExpMatchArray;
}
