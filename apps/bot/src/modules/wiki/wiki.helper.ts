import dayjs from 'dayjs';

import { WikiLanguage, WikiSiteData } from './types';

export abstract class WikiHelper {
  static pathnames: Record<WikiLanguage, WikiSiteData> = {
    en: {
      currentEvents: 'Portal:Current_events',
      featuredArticles: 'Wikipedia:Featured_articles',
      featuredPictures: 'Wikipedia:Featured_pictures',
    },
    uk: {
      currentEvents: 'Портал:Поточні_події',
      featuredArticles: 'Вікіпедія:Вибрані_статті',
      featuredPictures: 'Вікіпедія:Зображення_дня',
    },
    ru: {
      currentEvents: 'Портал:Текущие_события',
      featuredArticles: 'Википедия:Избранные_статьи',
      featuredPictures: 'Википедия:Изображение_дня',
    },
  };

  static getBaseURL(lang: WikiLanguage) {
    return `https://${lang}.wikipedia.org/wiki/`;
  }

  static getCurrentEventsURL(lang: WikiLanguage) {
    return this.getURLByType(lang, 'currentEvents');
  }

  static getFeaturedPicturesURL(lang: WikiLanguage) {
    return this.getURLByType(lang, 'featuredPictures');
  }

  static getFeaturedArticlesURL(lang: WikiLanguage) {
    return this.getURLByType(lang, 'featuredArticles');
  }

  static getURLByType(lang: WikiLanguage, type: keyof WikiSiteData) {
    return `${this.getBaseURL(lang)}${this.pathnames[lang][type]}`;
  }

  static getOnThisDayURL(lang: WikiLanguage) {
    const pathname = dayjs()
      .locale(lang)
      .format('DD MMMM')
      .replaceAll(' ', '_');

    return `${this.getBaseURL(lang)}${pathname}`;
  }

  static getDonationURL() {
    return 'https://donate.wikipedia.org/wiki/Ways_to_Give';
  }
}
