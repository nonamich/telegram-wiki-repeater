import { AsyncLocalStorage } from 'node:async_hooks';

import { i18n as I18n } from 'i18next';

export class I18nAsyncLocalStorage extends AsyncLocalStorage<I18n> {}
