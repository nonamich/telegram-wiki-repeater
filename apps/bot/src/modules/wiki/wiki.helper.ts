import dayjs from 'dayjs';

import { WikiLanguage, WikiSiteData } from './types';

export abstract class WikiHelper {
  static sites: Record<WikiLanguage, WikiSiteData> = {
    en: {
      currentEvents: 'Portal:Current_events',
      featuredArticles: 'Wikipedia:Featured_articles',
      featuredPictures: 'Wikipedia:Featured_pictures',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give',
    },
    uk: {
      currentEvents: 'Портал:Поточні_події',
      featuredArticles: 'Вікіпедія:Вибрані_статті',
      featuredPictures: 'Вікіпедія:Зображення_дня',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give/uk',
    },
    ru: {
      currentEvents: 'Портал:Текущие_события',
      featuredArticles: 'Википедия:Избранные_статьи',
      featuredPictures: 'Википедия:Изображение_дня',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give/ru',
    },
    ar: {
      currentEvents: 'ويكيبيديا:في_هذا_اليوم',
      featuredArticles: 'ويكيبيديا:مقالات_مختارة',
      featuredPictures: 'ويكيبيديا:صور_مختارة',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give',
    },
    es: {
      currentEvents: 'Portal:Actualidad',
      featuredArticles: 'Wikipedia:Artículo_destacado_en_portada',
      featuredPictures: 'Wikipedia:Recurso_del_día',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give/es',
    },
    pt: {
      currentEvents: 'Portal:Eventos_atuais',
      featuredArticles: 'Wikipédia:Artigos_destacados',
      featuredPictures: 'Wikipédia:Imagem_em_destaque',
      donate: 'https://donate.wikipedia.org/wiki/Ways_to_Give/pt',
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
    const value = this.sites[lang][type];

    if (!value || typeof value !== 'string') {
      throw new TypeError();
    }

    return `${this.getBaseURL(lang)}${value}`;
  }

  static getOnThisDayURL(lang: WikiLanguage) {
    const pathname = dayjs()
      .locale(lang)
      .format('DD MMMM')
      .replaceAll(' ', '_');

    return `${this.getBaseURL(lang)}${pathname}`;
  }
}
