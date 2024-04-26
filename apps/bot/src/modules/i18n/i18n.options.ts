import path from 'node:path';

import { InitOptions } from 'i18next';

import { I18nException } from './exceptions/i18n.exception';
import { I18N_LANGS } from './i18n.constants';

export const i18nextOptions: InitOptions = {
  debug: false,
  supportedLngs: I18N_LANGS,
  defaultNS: 'default',
  preload: I18N_LANGS,
  backend: {
    loadPath: path.resolve(__dirname, 'locales/{{lng}}/{{ns}}.json'),
  },
  interpolation: {
    escapeValue: false,
  },
  missingKeyHandler() {
    throw new I18nException(`Missing Key: ${''}`);
  },
};
