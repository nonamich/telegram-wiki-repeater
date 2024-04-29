import {
  WikiArticle,
  WikiImage,
  WikiMostRead,
  WikiNews,
  WikiOnThisDay,
} from '.';

export interface FeaturedRequest {
  year: number;
  month: number;
  day: number;
  lang: string;
}

export interface FeaturedResponse {
  tfa?: WikiFeaturedArticle;
  mostread?: WikiMostRead;
  image?: WikiFeaturedImage;
  onthisday?: WikiOnThisDay[];
  news?: WikiNews[];
}

export type ArticleSource = keyof FeaturedResponse;

export interface WikiFeaturedArticle extends WikiArticle {
  thumbnail?: WikiImage;
}

export interface WikiFeaturedImage {
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
}

interface Artist {
  html: string;
  text: string;
  name?: string;
}
