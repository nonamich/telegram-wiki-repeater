import { WikiArticle } from '.';

export interface WikiOnThisDay {
  text: string;
  pages: WikiArticle[];
  year: number;
}
