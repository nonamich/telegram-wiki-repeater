import i18next from 'i18next';

import { I18nAsyncLocalStorage } from './i18n.async-local-storage';

export class I18nContext {
  static storage = new I18nAsyncLocalStorage();

  constructor(readonly lang: string) {}

  async create(next: (...args: any[]) => Promise<void> | void) {
    const i18n = i18next.cloneInstance();

    await i18n.changeLanguage(this.lang);

    return I18nContext.storage.run(i18n, next);
  }

  static current() {
    return I18nContext.storage.getStore()!;
  }
}
