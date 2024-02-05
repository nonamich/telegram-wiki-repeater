import 'i18next';

import en from '../i18n/languages/en/default.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'default';
    resources: typeof en;
  }
}
