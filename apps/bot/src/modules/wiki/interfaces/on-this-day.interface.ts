import { WikiArticle } from '.';

export interface WikiOnThisDay {
  text: string;
  pages: WikiArticle[];
  year?: number;
  source?: 'event' | 'holiday';
}

export interface OnThisDayRequest {
  day: number;
  month: number;
  lang: string;
}

export interface OnThisDayResponse {
  births?: WikiOnThisDay[];
  deaths?: WikiOnThisDay[];
  events?: WikiOnThisDay[];
  holidays?: WikiOnThisDay[];
  selected?: WikiOnThisDay[];
}
