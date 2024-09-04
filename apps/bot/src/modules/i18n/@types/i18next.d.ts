import en from '~/../locales/en/default.json';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'default';
    resources: {
      default: typeof en;
    };
  }
}
