import { AsyncLocalStorage } from 'node:async_hooks';

import i18next, { i18n as I18n } from 'i18next';

import { WikiLanguage } from '../wiki/types';

export class I18nContext {
  static storage = new AsyncLocalStorage<I18n>();

  static async create(
    lang: WikiLanguage,
    next: (...args: any[]) => Promise<void> | void,
  ) {
    const i18n = i18next.cloneInstance();

    await i18n.changeLanguage(lang);

    return I18nContext.storage.run(i18n, next);
  }

  static current() {
    return I18nContext.storage.getStore();
  }
}
