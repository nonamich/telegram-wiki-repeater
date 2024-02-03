import { WikiArticle } from '.';

export interface OnThisDayResponse {
  text: string;
  pages: WikiArticle[];
  year: number;
}
