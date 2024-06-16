import { WikiArticle } from '.';

export interface OnThisDayResponse {
  events: WikiOnThisDay[];
}

export interface WikiOnThisDay {
  text: string;
  pages: WikiArticle[];
  year: number;
}
