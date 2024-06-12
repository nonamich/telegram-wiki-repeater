import { WikiArticle } from '.';

export interface WikiNews {
  links: WikiArticle[];
  story: string;
}
