import { WithLang } from '~/modules/telegram/interfaces';

import {
  WikiArticle,
  WikiImage,
  WikiMostRead,
  WikiNews,
  WikiOnThisDay,
} from '.';

export interface FeaturedRequest extends WithLang {
  year: number;
  month: number;
  day: number;
}

export interface FeaturedResponse {
  tfa?: WikiFeaturedArticle;
  mostread?: WikiMostRead;
  image?: WikiImageFeatured;
  onthisday?: WikiOnThisDay[];
  news?: WikiNews[];
}

export type ArticleSource = keyof FeaturedResponse;

export interface WikiFeaturedArticle extends WikiArticle {
  thumbnail?: WikiImage;
}

export interface WikiImageFeatured {
  title: string;
  thumbnail: WikiImage;
  image: WikiImage;
  file_page: string;
  artist: Artist;
  credit: Artist;
  license: {
    type: string;
    code: string;
    url: string;
  };
  description: {
    html: string;
    text: string;
    lang: string;
  };
  wb_entity_id: string;
  structured: {
    captions: {
      uk: string;
      en: string;
      vi: string;
    };
  };
}

interface Artist {
  html: string;
  text: string;
}
