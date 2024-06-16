import { WikiArticle } from '.';

export interface OnThisDayRequest {
  month: number;
  day: number;
  lang: string;
}

export interface OnThisDayResponse {
  events: WikiOnThisDay[];
}

export interface WikiOnThisDay {
  text: string;
  pages: WikiArticle[];
  year: number;
}
