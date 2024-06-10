import { FunctionComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

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
  beforeTitle: JSXInternal.Element | string;
  tags: HTagsProps['tags'];
};

export const Article: FunctionComponent<ArticleProps> = ({
  article,
  beforeTitle,
  tags,
}) => {
  return (
    <>
      <Title
        title={article.titles.normalized}
        url={article.content_urls.mobile.page}
        beforeTitle={beforeTitle}
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
