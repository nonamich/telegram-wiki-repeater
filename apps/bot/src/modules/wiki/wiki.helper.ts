import dayjs from 'dayjs';

import { WikiLanguage, WikiSiteData } from './types';

const baseDonateURL = 'https://donate.wikipedia.org/wiki/Ways_to_Give';

export abstract class WikiUtils {
  static sites: Record<WikiLanguage, WikiSiteData> = {
    en: {
      pathnames: {
        currentEvents: 'Portal:Current_events',
        featuredArticles: 'Wikipedia:Featured_articles',
        featuredPictures: 'Wikipedia:Featured_pictures',
      },
      donateURL: baseDonateURL,
    },
    uk: {
      pathnames: {
        currentEvents: 'Портал:Поточні_події',
        featuredArticles: 'Вікіпедія:Вибрані_статті',
        featuredPictures: 'Вікіпедія:Зображення_дня',
      },
      donateURL: `${baseDonateURL}/uk`,
    },
    ru: {
      pathnames: {
        currentEvents: 'Портал:Текущие_события',
        featuredArticles: 'Википедия:Избранные_статьи',
        featuredPictures: 'Википедия:Изображение_дня',
      },
      donateURL: `${baseDonateURL}/ru`,
    },
    ar: {
      pathnames: {
        currentEvents: 'ويكيبيديا:في_هذا_اليوم',
        featuredArticles: 'ويكيبيديا:مقالات_مختارة',
        featuredPictures: 'ويكيبيديا:صور_مختارة',
      },
      donateURL: baseDonateURL,
      isRTL: true,
    },
    es: {
      pathnames: {
        currentEvents: 'Portal:Actualidad',
        featuredArticles: 'Wikipedia:Artículo_destacado_en_portada',
        featuredPictures: 'Wikipedia:Recurso_del_día',
      },
      donateURL: `${baseDonateURL}/es`,
    },
    pt: {
      pathnames: {
        currentEvents: 'Portal:Eventos_atuais',
        featuredArticles: 'Wikipédia:Artigos_destacados',
        featuredPictures: 'Wikipédia:Imagem_em_destaque',
      },
      donateURL: `${baseDonateURL}/pt`,
    },
  };

  static getBaseURL(lang: WikiLanguage) {
    return `https://${lang}.wikipedia.org/wiki/`;
  }

  static getCurrentEventsURL(lang: WikiLanguage) {
    return this.getSpecificPageURL(lang, 'currentEvents');
  }

  static getFeaturedPicturesURL(lang: WikiLanguage) {
    return this.getSpecificPageURL(lang, 'featuredPictures');
  }

  static getFeaturedArticlesURL(lang: WikiLanguage) {
    return this.getSpecificPageURL(lang, 'featuredArticles');
  }

  static getSpecificPageURL(
    lang: WikiLanguage,
    type: keyof WikiSiteData['pathnames'],
  ) {
    const value = this.sites[lang].pathnames[type];

    return `${this.getBaseURL(lang)}${value}`;
  }

  static getOnThisDayURL(lang: WikiLanguage) {
    const pathname = dayjs().locale(lang).format('D MMMM').replaceAll(' ', '_');

    return `${this.getBaseURL(lang)}${pathname}`;
  }
}
