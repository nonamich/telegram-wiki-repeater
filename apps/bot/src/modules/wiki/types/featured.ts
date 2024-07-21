import { WikiArticle, WikiImage, WikiNews, WikiOnThisDay } from '.';

export interface FeaturedRequest {
  year: number;
  month: number;
  day: number;
  lang: string;
}

export interface FeaturedResponse {
  tfa?: WikiArticle;
  image?: WikiFeaturedImage;
  onthisday?: WikiOnThisDay[];
  news?: WikiNews[];
}

export interface WikiFeaturedImage {
  title: string;
  thumbnail: WikiImage;
  file_page: string;
  wb_entity_id: string;
  description?: {
    html: string;
  };
}
