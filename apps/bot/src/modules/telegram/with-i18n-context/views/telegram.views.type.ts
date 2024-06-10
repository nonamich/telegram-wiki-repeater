export type TypeOfArticle =
  | 'image'
  | 'tfa'
  | 'mostread'
  | 'news'
  | 'on_this_day';

export type Tag = TypeOfArticle | string;
