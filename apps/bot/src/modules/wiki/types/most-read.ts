import { WikiArticle } from '.';

export interface WikiMostReadArticle extends WikiArticle {
  views: number;
  rank: number;
  view_history: ViewHistory[];
}

export interface WikiMostRead {
  date: string;
  articles: WikiMostReadArticle[];
}

interface ViewHistory {
  date: string;
  views: number;
}
