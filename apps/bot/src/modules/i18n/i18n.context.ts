import i18next from 'i18next';

import { I18nAsyncLocalStorage } from './i18n.async-local-storage';

export class I18nContext {
  static storage = new I18nAsyncLocalStorage();

  static async create(
    lang: string,
    next: (...args: any[]) => Promise<void> | void,
  ) {
    const i18n = i18next.cloneInstance();

    await i18n.changeLanguage(lang);

    return I18nContext.storage.run(i18n, next);
  }

  static current() {
    return I18nContext.storage.getStore()!;
  }
}
