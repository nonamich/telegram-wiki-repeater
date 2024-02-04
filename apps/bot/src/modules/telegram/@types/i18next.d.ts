import 'i18next';

import { TelegramLanguage } from '../i18n/telegram.i18n.interface';
import { en } from '../i18n/telegram.i18n.langs';

declare module 'i18next' {
  interface CustomTypeOptions {
    language: TelegramLanguage;

    resources: typeof en;
  }
}
