import { FunctionComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiArticle } from '~/modules/wiki/types';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

import { Article } from '../components/Article';

export type FeaturedArticleProps = {
  article: WikiArticle;
};

export const FeaturedArticle: FunctionComponent<FeaturedArticleProps> = ({
  article,
}) => {
  const { language, t } = useI18n();
  const link = {
    url: WikiHelper.getFeaturedArticlesURL(language),
    text: t('more_featured_articles'),
  };

  return <Article article={article} beforeTitle={'⭐️'} link={link} />;
};
