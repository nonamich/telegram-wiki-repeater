import 'i18next';

import en from '../locales/en/default.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'default';
    resources: {
      default: typeof en;
    };
  }
}
