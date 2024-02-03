import {
  WikiLanguage,
  WikiArticle,
  WikiImage,
  MostReadResponse,
  News,
  OnThisDayResponse,
} from '.';

export interface FeaturedRequest {
  lang: WikiLanguage;
  year: number;
  month: number;
  day: number;
}

export interface FeaturedResponse {
  tfa?: WikiFeaturedArticle;
  mostread?: MostReadResponse;
  image?: WikiImageFeatured;
  onthisday?: OnThisDayResponse[];
  news?: News[];
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
