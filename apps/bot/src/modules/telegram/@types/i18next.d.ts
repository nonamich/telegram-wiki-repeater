import 'i18next';

import * as resources from '../i18n/languages';
import { TelegramLanguage } from '../i18n/telegram.i18n.interface';

declare module 'i18next' {
  interface CustomTypeOptions {
    language: TelegramLanguage;

    resources: typeof resources;
  }
}
