import { FunctionComponent } from 'preact';

import { useI18n } from '~/modules/telegram/views/hooks';
import { WikiArticle } from '~/modules/wiki/types';
import { WikiSites } from '~/modules/wiki/wiki.sites';

import { Article } from '../components/Article';

export type FeaturedArticleProps = {
  article: WikiArticle;
};

export const FeaturedArticle: FunctionComponent<FeaturedArticleProps> = ({
  article,
}) => {
  const { language, t } = useI18n();
  const link = {
    url: WikiSites.getFeaturedArticlesURL(language),
    text: t('more_featured_articles'),
  };

  return <Article article={article} beforeTitle={'⭐️'} link={link} />;
};
