import { WikiArticle } from '.';

export interface MostReadArticle extends WikiArticle {
  views: number;
  rank: number;
  view_history: ViewHistory[];
}

export interface MostReadResponse {
  date: string;
  articles: MostReadArticle[];
}

interface ViewHistory {
  date: string;
  views: number;
}
