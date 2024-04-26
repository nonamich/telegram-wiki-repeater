import { WIKI_LANGUAGES } from '~/modules/wiki/wiki.constants';

export const I18N_LANGS = WIKI_LANGUAGES;

export const I18N_LANGS_INFO: Record<
  (typeof WIKI_LANGUAGES)[number],
  { icon: string; name: string }
> = {
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
