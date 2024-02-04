import { WikiArticle } from '.';

export interface WikiArticleMostRead extends WikiArticle {
  views: number;
  rank: number;
  view_history: ViewHistory[];
}

export interface WikiMostRead {
  date: string;
  articles: WikiArticleMostRead[];
}

interface ViewHistory {
  date: string;
  views: number;
}
