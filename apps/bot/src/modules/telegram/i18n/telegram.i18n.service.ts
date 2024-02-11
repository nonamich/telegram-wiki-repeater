import { Injectable, OnModuleInit } from '@nestjs/common';

import {
  I18N_DEFAULT_LANG,
  I18N_SUPPORTED_LANGS,
} from './telegram.i18n.constants';
import { TelegramLanguage } from './telegram.i18n.interface';

@Injectable()
export class TelegramI18nService implements OnModuleInit {
  async onModuleInit() {
    for (const lang of I18N_SUPPORTED_LANGS) {
      await import(`dayjs/locale/${lang}`);
    }
  }

  getLang(lang?: string): TelegramLanguage {
    if (lang && I18N_SUPPORTED_LANGS.includes(lang as TelegramLanguage)) {
      return lang as TelegramLanguage;
    }

    return I18N_DEFAULT_LANG;
  }
}
