import { TelegramLanguageList } from './telegram.i18n.interface';

export const I18N_SUPPORTED_LANGS: TelegramLanguageList = {
  en: {
    name: 'English',
    icon: '🇬🇧',
  },
  de: {
    name: 'Deutsch',
    icon: '🇩🇪',
  },
  uk: {
    name: 'Українська',
    icon: '🇺🇦',
  },
  el: {
    name: 'Ελληνικά',
    icon: '🇬🇷',
  },
  he: {
    name: 'עברית',
    icon: '🇮🇱',
  },
  hu: {
    name: 'Magyar',
    icon: '🇭🇺',
  },
  ja: {
    name: '日本語',
    icon: '🇯🇵',
  },
  sv: {
    name: 'Svenska',
    icon: '🇸🇪',
  },
  sd: {
    name: 'سنڌي',
    icon: '🇵🇰 🇮🇳',
  },
  ur: {
    name: 'اردو',
    icon: '🇵🇰 🇮🇳',
  },
  zh: {
    name: '中文',
    icon: '🇨🇳',
  },
};

export const I18N_DEFAULT_LANG: keyof typeof I18N_SUPPORTED_LANGS = 'en';
