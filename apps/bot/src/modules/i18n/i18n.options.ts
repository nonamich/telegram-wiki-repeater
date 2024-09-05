import path from 'node:path';

import { InitOptions } from 'i18next';

import { I18N_LANGS } from './i18n.constants';

export const i18nextOptions: InitOptions = {
  debug: false,
  supportedLngs: I18N_LANGS,
  ns: 'default',
  defaultNS: 'default',
  preload: I18N_LANGS,
  backend: {
    loadPath: path.resolve(__dirname, '../../../locales/{{lng}}/{{ns}}.json'),
  },
  interpolation: {
    escapeValue: false,
  },
};
