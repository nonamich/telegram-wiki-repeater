import { AsyncLocalStorage } from 'node:async_hooks';

import i18next, { i18n as I18n } from 'i18next';

import { WikiLanguage } from '~/modules/wiki/types';

type CustomI18nType = I18n & {
  language: WikiLanguage;
};

export class I18nContext {
  static storage = new AsyncLocalStorage<CustomI18nType>();

  static async create(
    lang: WikiLanguage,
    next: (...args: any[]) => Promise<void> | void,
  ) {
    const i18n = i18next.cloneInstance() as CustomI18nType;

    await i18n.changeLanguage(lang);

    return I18nContext.storage.run(i18n, next);
  }

  static current() {
    return I18nContext.storage.getStore();
  }
}
