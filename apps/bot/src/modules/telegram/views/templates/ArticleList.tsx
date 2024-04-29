import { FunctionalComponent } from 'preact';

import { WikiArticle } from '~/modules/wiki/interfaces';

import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '../../telegram.constants';
import {
  BR,
  Description,
  HTags,
  HTagsProps,
  Links,
  LinksProps,
  NewLine,
  Title,
} from '../components';

export type ArticleListProps = {
  title: string;
  icon: string;
  articles: WikiArticle[];
  tags: HTagsProps['tags'];
  source?: LinksProps['source'];
};

export const ArticleList: FunctionalComponent<ArticleListProps> = ({
  title,
  icon,
  articles,
  tags,
  source,
}) => {
  articles = articles.slice(0, 5);

  return (
    <>
      {icon}{' '}
      <TELEGRAM_TAG_DANGEROUSLY_HTML
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <BR />
      {articles.map((article, index) => {
        return (
          <>
            {index > 0 && <NewLine />}
            <Title
              icon="•"
              title={article.titles.normalized}
              url={article.content_urls.mobile.page}
            />
            <Description description={article.description} />;
          </>
        );
      })}
      <BR />
      <HTags tags={tags} />
      <BR />
      <Links source={source} />
    </>
  );
};
