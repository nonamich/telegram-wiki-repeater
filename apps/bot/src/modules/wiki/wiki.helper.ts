import dayjs from 'dayjs';

import { WikiSiteData } from './types';

export abstract class WikiHelper {
  static pathnames: Record<string, WikiSiteData> = {
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
  };

  static getBaseURL(lang: string) {
    return `https://${lang}.wikipedia.org/wiki/`;
  }

  static getCurrentEventsURL(lang: string) {
    return this.getURL(lang, 'currentEvents');
  }

  static getFeaturedPicturesURL(lang: string) {
    return this.getURL(lang, 'featuredPictures');
  }

  static getFeaturedArticlesURL(lang: string) {
    return this.getURL(lang, 'featuredArticles');
  }

  static getURL(lang: string, type: keyof WikiSiteData) {
    return `${this.getBaseURL(lang)}${this.pathnames[lang][type]}`;
  }

  static getOnThisDayURL(lang: string) {
    const pathname = dayjs()
      .locale(lang)
      .format('DD MMMM')
      .replaceAll(' ', '_');

    return `${this.getBaseURL(lang)}${pathname}`;
  }
}
