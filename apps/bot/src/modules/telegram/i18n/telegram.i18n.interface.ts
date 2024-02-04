import { InitOptions } from 'i18next';

import { WIKI_SUPPORT_LANGUAGE } from '~/modules/wiki/wiki.constants';

import { en } from './languages';

export type TelegramLanguage = (typeof WIKI_SUPPORT_LANGUAGE)[number];

export type TelegramLanguageList = {
  [T in TelegramLanguage]: string;
};

export interface I18NextOptions extends InitOptions {
  resources: {
    [key in TelegramLanguage]: typeof en;
  };
}
