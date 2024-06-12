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
    return this.getURLByType(lang, 'currentEvents');
  }

  static getFeaturedPicturesURL(lang: string) {
    return this.getURLByType(lang, 'featuredPictures');
  }

  static getFeaturedArticlesURL(lang: string) {
    return this.getURLByType(lang, 'featuredArticles');
  }

  static getURLByType(lang: string, type: keyof WikiSiteData) {
    return `${this.getBaseURL(lang)}${this.pathnames[lang][type]}`;
  }

  static getOnThisDayURL(lang: string) {
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
