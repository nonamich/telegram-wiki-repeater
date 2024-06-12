import { FunctionComponent } from 'preact';

import { WikiMostReadArticle } from '~/modules/wiki/types';

import { Article } from '../components/Article';

export type MostReadProps = {
  article: WikiMostReadArticle;
};

export const MostRead: FunctionComponent<MostReadProps> = ({ article }) => {
  return <Article article={article} beforeTitle={'⚡'} />;
};
