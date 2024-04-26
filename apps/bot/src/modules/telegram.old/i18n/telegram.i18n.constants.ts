import { WIKI_LANGUAGES } from '~/modules/wiki/wiki.constants';

import { TelegramLanguageList } from './telegram.i18n.interface';

export const I18N_SUPPORTED_LANGS = WIKI_LANGUAGES;
export const I18N_LANGS_INFO: TelegramLanguageList = {
  ar: {
    icon: '☪',
    name: 'اللغة العربية',
  },
  en: {
    icon: '🇬🇧',
    name: 'English',
  },
  es: {
    icon: '🇪🇸',
    name: 'Español',
  },
  hi: {
    icon: '🇮🇳',
    name: 'Hindi',
  },
  id: {
    icon: '🇮🇩',
    name: 'Bahasa Indonesia',
  },
  pt: {
    icon: '🇵🇹',
    name: 'Portuguesa',
  },
  tr: {
    icon: '🇹🇷',
    name: 'Türkçe',
  },
  uk: {
    icon: '🇺🇦',
    name: 'Українська',
  },
  vi: {
    icon: '🇻🇳',
    name: 'Tiếng Việt',
  },
};

export const I18N_DEFAULT_LANG = 'en';
