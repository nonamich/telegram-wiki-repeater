import { FunctionComponent } from 'preact';

import { WikiArticle } from '~/modules/wiki/interfaces';

import {
  BR,
  Content,
  Description,
  HTags,
  HTagsProps,
  Links,
  Title,
} from '../components';

export type ArticleProps = {
  article: WikiArticle;
  icon: string;
  tags: HTagsProps['tags'];
};

export const Article: FunctionComponent<ArticleProps> = ({
  article,
  icon,
  tags,
}) => {
  return (
    <>
      <Title
        title={article.titles.normalized}
        url={article.content_urls.mobile.page}
        icon={icon}
      />
      <Description description={article.description} />
      <BR />
      <Content content={article.extract_html} />
      <BR />
      <HTags tags={tags} />
      <BR />
      <Links source={article.content_urls.mobile.page} />
    </>
  );
};
