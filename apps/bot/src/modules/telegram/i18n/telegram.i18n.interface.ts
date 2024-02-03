import { InitOptions } from 'i18next';

import { WikiLanguage } from '~/modules/wiki/interfaces';

import { enResource } from './resources/en.resource';

export interface TelegramLanguageItem {
  name: string;
  icon: string;
}

export type TelegramLanguageList = {
  [T in WikiLanguage]: TelegramLanguageItem;
};

export interface I18NextOptions extends InitOptions {
  resources: I18NResources;
}

export type I18NResources = {
  [key in WikiLanguage]: typeof enResource;
};
